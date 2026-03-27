import React from 'react'
import style from './Footer.module.css'
import logo from '../../assets/logo.jpg'
import mapIcon from '../../assets/map-icon.svg'
import moneyIcon from '../../assets/money-icon.svg'
import freeIcon from '../../assets/free-icon.svg'
import deliveryIcon from '../../assets/delivery-icon.svg'
import { BsLinkedin, BsInstagram, BsFacebook } from "react-icons/bs";
import { AiFillTikTok } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";

const ICON_COLOR = "#EB8E1E";
const ICON_SIZE = 22;

const Footer = () => {
    return (
        <footer className={style.footer}>
            <div className={style.wave}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C300,60 600,60 900,30 C1050,15 1150,0 1200,0 L1200,120 L0,120 Z"
                        fill="currentColor" />
                </svg>
            </div>

            <div className={style.container}>
                <div className={style.brandSection}>
                    <div className={style.logoWrapper}>
                        <img src={logo} alt="EZ Home" className={style.logo} />
                    </div>
                    <p className={style.brandTagline}>
                        جعل منزلك أكثر راحة وأناقة
                    </p>
                </div>

                <div className={style.featuresSection}>
                    <h2 className={style.sectionTitle}>لماذا EZ Home؟</h2>
                    <div className={style.featuresGrid}>
                        <div className={style.featureCard}>
                            <div className={style.featureIcon}>
                                <img src={freeIcon} alt="icon" />
                            </div>
                            <h3>توصيل مجاني</h3>
                            <p>الى جميع أنحاء المملكة</p>
                        </div>
                        <div className={style.featureCard}>
                            <div className={style.featureIcon}>
                                <img src={moneyIcon} alt="icon" />
                            </div>
                            <h3>الدفع عند الاستلام</h3>
                            <p>آمن ومريح</p>
                        </div>
                        <div className={style.featureCard}>
                            <div className={style.featureIcon}>
                                <img src={deliveryIcon} alt="icon" />
                            </div>
                            <h3>توصيل سريع</h3>
                            <p>خلال 1-2 يوم</p>
                        </div>
                        <div className={style.featureCard}>
                            <div className={style.featureIcon}>
                                <img src={mapIcon} alt="icon" />
                            </div>
                            <h3>نغطي كل الأردن</h3>
                            <p>بأسعار مناسبة</p>
                        </div>
                    </div>
                </div>

                <div className={style.contactSection}>
                    <h2 className={style.sectionTitle}>تواصل معنا</h2>
                    <div className={style.contactLinks}>
                        <a href="tel:0791775030" className={style.socialLink}>
                            <span className={style.iconWrapper}>
                                <BsTelephone size={ICON_SIZE} color={ICON_COLOR} />
                            </span>
                            <span>0791775030</span>
                        </a>
                        <a href="https://www.instagram.com/ezhomejo/" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
                            <span className={style.iconWrapper}>
                                <BsInstagram size={ICON_SIZE} color={ICON_COLOR} />
                            </span>
                            <span>@ezhome</span>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61585700071746" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
                            <span className={style.iconWrapper}>
                                <BsFacebook size={ICON_SIZE} color={ICON_COLOR} />
                            </span>
                            <span>EZ HOME</span>
                        </a>
                        <a href="https://www.linkedin.com/in/ez-home-88222b3a7" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
                            <span className={style.iconWrapper}>
                                <BsLinkedin size={ICON_SIZE} color={ICON_COLOR} />
                            </span>
                            <span>EZ HOME</span>
                        </a>
                        <a href="https://www.tiktok.com/@ez.home5" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
                            <span className={style.iconWrapper}>
                                <AiFillTikTok size={ICON_SIZE + 2} color={ICON_COLOR} />
                            </span>
                            <span>EZ HOME</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className={style.bottomBar}>
                <p>© {new Date().getFullYear()} EZ Home - جميع الحقوق محفوظة</p>
            </div>
        </footer>
    )
}

export default Footer