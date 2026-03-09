import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import style from './Favorite.module.css'
import { useState, useEffect } from 'react'
import api from "../../api/axios";
import Card from '../../components/Card/Card'
import { useNavigate } from 'react-router-dom'

const SkeletonCard = () => (
    <div className={style.skeletonCard}>
        <div className={style.skeletonImage} />
        <div className={style.skeletonInfo}>
            <div className={`${style.skeletonLine} ${style.skeletonTitle}`} />
            <div className={`${style.skeletonLine} ${style.skeletonPrice}`} />
            <div className={`${style.skeletonLine} ${style.skeletonDesc}`} />
            <div className={`${style.skeletonLine} ${style.skeletonDescShort}`} />
        </div>
    </div>
)

const Favorite = () => {
    const [products, setProducts] = useState([]);
    const [cover, setCover] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/wishlist");
            setProducts(res.data.data.products)
            if (res.data.data.products.length === 0)
                setCover(true)
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token"))
            navigate("/login")
        window.scrollTo(0, 0);
        loadProducts();
    }, []);

    return (
        <>
            <Navbar />

            {loading ? (
                <div className={style.loadingScreen}>
                    <div className={style.loadingInner}>
                        <div className={`${style.skeletonLine} ${style.skeletonHeading}`} />
                        <div className={style.cards}>
                            {[...Array(4)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {!cover && <h1>قائمة المنتجات المفضلة</h1>}
                    {cover &&
                        <div className={style.empty}>
                            <p>لا يوجد منتجات مفضلة!</p>
                        </div>
                    }
                    <div className={style.container}>
                        <div className={style.cards}>
                            {products.map(Element => (
                                <Card
                                    key={Element._id}
                                    id={Element._id}
                                    title={Element.name}
                                    img={Element.image}
                                    price={Element.price}
                                    description={Element.description}
                                    forceFavorite={true}
                                    onRemove={(id) => {
                                        setProducts(prev =>
                                            prev.filter(product => product._id !== id)
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Footer />
        </>
    )
}

export default Favorite