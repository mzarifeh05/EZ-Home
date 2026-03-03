import React, { useState, useEffect, useRef } from 'react'
import style from './Navbar.module.css'
import logo from '../../assets/logo.jpg'
import searchIcon from '../../assets/search-icon.svg'
import favoriteIcon from '../../assets/favorite-icon.svg'
import cartIcon from '../../assets/cart-icon.svg'
import menueIcon from '../../assets/menu-icon.svg'
import closeIcon from '../../assets/close-icon.svg'
import loginIcon from '../../assets/login-icon.svg'
import SideMenue from '../SideMenue/SideMenue'
import logoutIcon from '../../assets/logout-icon.svg'
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup'
import { useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from "react-icons/md";


const Navbar = ({ removed = false }) => {
    const [open, setOpen] = useState(true);
    const [side, setSide] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Optional: Prevent jitter on tiny scrolls
            if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
                return;
            }

            if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
                setVisible(true);
            } else {
                setVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/")
        setShowConfirm(false);
    };

    return (
        <>
            {showConfirm && (
                <ConfirmPopup
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            <SideMenue display={side} />

            <div className={`${style.navbarWrapper} ${visible ? style.navbarVisible : style.navbarHidden}`}>
                <div className={style.container}>
                    <img onClick={() => navigate('/')} src={logo} alt="logo" />
                    {!removed && <div className={style.searchContainer}>
                        <input
                            placeholder='بحث عن منتج'
                            dir='rtl'
                            id='search-box'
                            type="search" />
                        <label htmlFor="search-box">
                            <img src={searchIcon} alt="search-icon" />
                        </label>
                    </div>}
                    {!removed && <div className={style.icons}>
                        {localStorage.getItem("role") === "admin" && 
                            <MdAdminPanelSettings className={style.adminButton} onClick={() => navigate("/admin")} size={45} color='#EB8E1E' />
                        }
                        {
                            localStorage.getItem("role") !== "admin" && 
                            <img onClick={() => navigate('/favorite')} src={favoriteIcon} alt="favorite-icon" />
                        }
                        {
                            localStorage.getItem("role") !== "admin" && 
                            <img onClick={() => navigate('/cart')} src={cartIcon} alt="cart-icon" />
                        }
                        {!localStorage.getItem("token") &&
                            <img onClick={() => navigate("/login")} src={loginIcon} alt="profile-icon" />
                        }
                        {localStorage.getItem("token") &&
                            <img onClick={() => setShowConfirm(true)} src={logoutIcon} alt="logout-icon" />
                        }
                    </div>}
                    {!removed && <div className={style.menu}>
                        {open
                            ? <img onClick={() => { setOpen(!open); setSide(!side) }} src={menueIcon} />
                            : <img onClick={() => { setOpen(!open); setSide(!side) }} src={closeIcon} />
                        }
                    </div>}

                </div>
            </div>

            <div className={style.navbarSpacer} />
        </>
    )
}

export default Navbar