import React from 'react'
import style from './SideMenu.module.css'
import favoriteIcon from '../../assets/favorite-icon.svg'
import cartIcon from '../../assets/cart-icon.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logoutIcon from '../../assets/logout-icon.svg'
import loginIcon from '../../assets/login-icon.svg'
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup'
import { MdAdminPanelSettings } from "react-icons/md";

const SideMenue = ({ display }) => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

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
            {display && <div className={style.container}>
                {
                    localStorage.getItem("role") === "admin" &&
                    <div className={style.section}>
                        <MdAdminPanelSettings className={style.adminButton} onClick={() => navigate("/admin")} size={45} color='#EB8E1E' />
                        <p onClick={() => navigate('/favorite')}>لوحة التحكم</p>
                    </div>
                }
                {
                    localStorage.getItem("role") !== "admin" &&
                    <div className={style.section}>
                        <img src={favoriteIcon} alt="favorite-icon" />
                        <p onClick={() => navigate('/favorite')}>المفضلة</p>
                    </div>
                }
                {
                    localStorage.getItem("role") !== "admin" &&
                    <div onClick={() => navigate('/cart')} className={style.section}>
                        <img src={cartIcon} alt="cart-icon" />
                        <p>سلتي</p>
                    </div>
                }
                {
                    localStorage.getItem("token")
                        ?
                        <div className={style.section}>
                            <img src={logoutIcon} alt="profile-icon" />
                            <p onClick={() => setShowConfirm(true)} src={logoutIcon}>تسجيل الخروج</p>
                        </div>
                        :
                        <div className={style.section}>
                            <img src={loginIcon} alt="profile-icon" />
                            <p onClick={() => navigate("/login")}>تسجيل الدخول</p>
                        </div>
                }
            </div>}
        </>
    )
}

export default SideMenue
