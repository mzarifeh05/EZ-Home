import React, { useRef, useState, useEffect } from 'react';
import style from './Home.module.css'
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const productsRef = useRef(null);
    const navigate = useNavigate();
    const [wishlistIds, setWishlistIds] = useState([]);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("none");

    const isAdmin = localStorage.getItem('role') === 'admin';

    useEffect(() => {
        console.log(localStorage.getItem("token"))
        const loadProducts = async () => {
            try {
                const res = await api.get("/product");
                setProducts(res.data.data)
                console.log(res.data.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        loadProducts()
        const loadCategories = async () => {
            try {
                const res = await api.get("/category");
                console.log(res.data.data)
                setCategories(res.data.data)
            }
            catch (error) {
                console.log(error)
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

    const handleCategoryChange = (event) => {
        setCategory(event.target.value)
    }

    return (
        <>
            <Navbar />
            <Hero onProductsClick={() => scrollToSection(productsRef)} />
            <div className={style.container} ref={productsRef}>
                <div className={style.category}>
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="none">
                            جميع المنتجات
                        </option>
                        {categories.map(Element =>
                            <option key={Element._id} value={Element.name}>
                                {Element.name}
                            </option>
                        )}
                    </select>
                </div>
                <div className={style.cards}>
                    {products
                        .filter(Element => category === Element.category.name || category === "none")
                        .map(Element => (
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
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home