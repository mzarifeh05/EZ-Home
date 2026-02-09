import React from 'react'
import style from './Footer.module.css'
import logo from '../../assets/logo.jpg'
import instagramLogo from '../../assets/instagram-icon.png'
import facebookLogo from '../../assets/facebook-icon.png'
import phoneIcon from '../../assets/phone-icon-orange.png'
import mapIcon from '../../assets/map-icon.svg'
import moneyIcon from '../../assets/money-icon.svg'
import freeIcon from '../../assets/free-icon.svg'
import deliveryIcon from '../../assets/delivery-icon.svg'

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
                            <p>داخل عمان</p>
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
                        <a
                            href="https://www.instagram.com/ezhomejo/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={style.socialLink}
                        >
                            <img src={instagramLogo} alt="Instagram" />
                            <span>@ezhome</span>
                        </a>
                        <a
                            href="https://www.facebook.com/profile.php?id=61585700071746"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={style.socialLink}
                        >
                            <img src={facebookLogo} alt="Facebook" />
                            <span>EZ HOME</span>
                        </a>
                        <a
                            href="tel:0791775030"
                            className={style.socialLink}
                        >
                            <img src={phoneIcon} alt="Phone" />
                            <span>0791775030</span>
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
