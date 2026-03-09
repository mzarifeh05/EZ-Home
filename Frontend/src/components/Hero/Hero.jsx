import React from 'react'
import style from './Hero.module.css'
import heroImg from '../../assets/Hero.png'

const Hero = ({ onProductsClick }) => {
    return (
        <section className={style.hero}>

            {/* Background grid lines */}
            <div className={style.grid} aria-hidden="true" />

            {/* Glow orb behind image */}
            <div className={style.glow} aria-hidden="true" />

            {/* ── Text Side ── */}
            <div className={style.content}>

                <div className={style.badge}>
                    <span className={style.badgeDot} />
                    توصيل مجاني لجميع أنحاء المملكة عند الطلب من الموقع
                </div>

                <h1 className={style.headline}>
                    كل ما يحتاجه بيتك
                    <br />
                    من{' '}
                    <span className={style.accent}>أجهزة منزلية</span>
                </h1>

                <p className={style.sub}>
                    بجودة عالية وأسعار تناسبك — راحتك تبدأ من هنا
                </p>

                <div className={style.actions}>
                    <button className={style.primaryBtn} onClick={onProductsClick}>
                        تسوّق الآن
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>


            </div>

            {/* ── Image Side ── */}
            <div className={style.imageWrap} onClick={onProductsClick}>
                <img src={heroImg} alt="أجهزة منزلية" className={style.heroImg} />

            </div>

        </section>
    )
}

export default Hero