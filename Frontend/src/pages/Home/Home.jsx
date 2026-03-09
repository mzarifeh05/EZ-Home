import React, { useRef, useState, useEffect } from 'react';
import style from './Home.module.css'
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';

// Module-level cache — persists across re-renders and navigation within the same tab
let productCache = null;
let productCacheTime = null;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

const Home = () => {
    const productsRef = useRef(null);
    const navigate = useNavigate();
    const [wishlistIds, setWishlistIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("none");
    const [priceSort, setPriceSort] = useState("none");
    const [loading, setLoading] = useState(true);

    const isAdmin = localStorage.getItem('role') === 'admin';

    useEffect(() => {
        const loadProducts = async () => {
            const now = Date.now();
            if (productCache && productCacheTime && now - productCacheTime < CACHE_DURATION) {
                setProducts(productCache);
                setLoading(false);
                return;
            }
            try {
                const res = await api.get("/product");
                productCache = res.data.data;
                productCacheTime = Date.now();
                setProducts(productCache);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();

        const loadCategories = async () => {
            try {
                const res = await api.get("/category");
                setCategories(res.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadCategories();

        const fetchWishlist = async () => {
            if (localStorage.getItem("role") !== "user") return;
            try {
                const res = await api.get("/wishlist");
                const ids = res.data.data.products.map(p => p._id);
                setWishlistIds(ids);
            } catch (err) {
                console.log(err);
            }
        };
        fetchWishlist();
    }, []);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (value.trim() !== '' && productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handlePriceSortChange = (event) => {
        setPriceSort(event.target.value);
    }

    const filteredProducts = products
        .filter(Element => {
            const matchesCategory = category === Element.category.name || category === "none";
            const matchesSearch = Element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                Element.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (priceSort === "high") return b.price - a.price;
            if (priceSort === "low") return a.price - b.price;
            return 0;
        });

    return (
        <>
            <Navbar
                Home={true}
                onSearch={handleSearch}
                searchValue={searchQuery}
            />
            <Hero onProductsClick={() => scrollToSection(productsRef)} />
            <div className={style.container} ref={productsRef}>
                <div className={style.category}>
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="none">جميع المنتجات</option>
                        {categories.map(Element =>
                            <option key={Element._id} value={Element.name}>
                                {Element.name}
                            </option>
                        )}
                    </select>
                    <select value={priceSort} onChange={handlePriceSortChange}>
                        <option value="none">ترتيب حسب السعر</option>
                        <option value="high">السعر: من الأعلى</option>
                        <option value="low">السعر: من الأقل</option>
                    </select>
                </div>

                {loading ? (
                    <div className={style.skeletonGrid}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className={style.skeletonCard}>
                                <div className={style.skeletonImage} />
                                <div className={style.skeletonBody}>
                                    <div className={style.skeletonTitle} />
                                    <div className={style.skeletonDesc} />
                                    <div className={style.skeletonDescShort} />
                                    <div className={style.skeletonFooter}>
                                        <div className={style.skeletonPrice} />
                                        <div className={style.skeletonBtn} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={style.cards}>
                        {filteredProducts.length > 0
                            ? filteredProducts.map(Element => (
                                <Card
                                    id={Element._id}
                                    key={Element._id}
                                    title={Element.name}
                                    img={Element.image}
                                    price={Element.price}
                                    description={Element.description}
                                    wishlistIds={wishlistIds}
                                />
                            ))
                            : searchQuery.trim() !== '' && (
                                <p style={{ textAlign: 'center', width: '100%', color: '#888', padding: '2rem' }}>
                                    لا توجد نتائج للبحث عن "{searchQuery}"
                                </p>
                            )
                        }
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Home