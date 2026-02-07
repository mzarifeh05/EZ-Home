import React from 'react'
import style from './Hero.module.css'
import heroImg from '../../assets/hero-cover.png'

const Hero = () => {
    return (
        <>
            <div className={style.container}>
                <div className={style.content}>
                    <h1>
                        كل ما يحتاجه بيتك من أجهزة منزلية
                        <br />
                        بجودة عالية وأسعار تناسبك
                    </h1>
                    <h3>
                        راحتك تبدأ من هنا
                    </h3>
                    <button>
                        تسوّق الآن
                    </button>
                </div>
                <img src={heroImg} alt="hero-img" />
            </div>
        </>
    )
}

export default Hero
