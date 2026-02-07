import React, { useRef } from 'react';
import style from './Home.module.css'
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Card from '../../components/Card/Card';


const Home = () => {
    const productsRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Navbar />
            <Hero onProductsClick={() => scrollToSection(productsRef)} />
            <div className={style.container} ref={productsRef}>
                <div className={style.category}>
                    <select name="" id="">
                        <option value="">
                            جميع المنتجات
                        </option>
                    </select>
                </div>
                <div className={style.cards}>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </>
    )
}

export default Home
