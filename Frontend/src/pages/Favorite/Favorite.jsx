import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import style from './Favorite.module.css'
import { useState, useEffect } from 'react'
import api from "../../api/axios";
import Card from '../../components/Card/Card'
import { useNavigate } from 'react-router-dom'

const Favorite = () => {
    const [products, setProducts] = useState([]);
    const [cover, setCover] = useState(false);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const res = await api.get("/wishlist");
            setProducts(res.data.data.products)
            console.log(res.data.data.products)
            if (res.data.data.products.length === 0)
                setCover(true)
        }
        catch (error) {
            console.log(error)
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
                    ))
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Favorite
