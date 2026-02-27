import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import style from './Favorite.module.css'
import { useState, useEffect } from 'react'
import api from "../../api/axios";
import Card from '../../components/Card/Card'

const Favorite = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await api.get("/product");
                setProducts(res.data.data)
                console.log(res.data.data)
            }
            catch (error) {
                console.log(error)
            }
        };
        loadProducts();
    }, []);

    return (
        <>
            <Navbar />
            <div className={style.container}>
                <h1>قائمة المنتجات المفضلة</h1>
                <div className={style.cards}>
                    {products.map(Element => (
                        <Card
                            key={Element._id}
                            title={Element.name}
                            img={Element.image}
                            price={Element.price}
                            description={Element.description}
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
