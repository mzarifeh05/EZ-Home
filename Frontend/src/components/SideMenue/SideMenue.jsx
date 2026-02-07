import React from 'react'
import style from './SideMenu.module.css'
import favoriteIcon from '../../assets/favorite-icon.svg'
import cartIcon from '../../assets/cart-icon.svg'
import profileIcon from '../../assets/profile-icon.svg'

const SideMenue = ({ display }) => {
    return (
        <>
            {display && <div className={style.container}>
                <div className={style.section}>
                    <img src={profileIcon} alt="profile-icon" />
                    <p>حسابي</p>
                </div>
                <div className={style.section}>
                    <img src={favoriteIcon} alt="favorite-icon" />
                    <p>المفضلة</p>
                </div>
                <div className={style.section}>
                    <img src={cartIcon} alt="cart-icon" />
                    <p>سلتي</p>
                </div>
            </div>}
        </>
    )
}

export default SideMenue
