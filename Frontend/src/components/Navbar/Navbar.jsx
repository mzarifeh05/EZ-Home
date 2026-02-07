import React, { useState } from 'react'
import style from './Navbar.module.css'
import logo from '../../assets/logo.jpg'
import searchIcon from '../../assets/search-icon.svg'
import favoriteIcon from '../../assets/favorite-icon.svg'
import cartIcon from '../../assets/cart-icon.svg'
import menueIcon from '../../assets/menu-icon.svg'
import closeIcon from '../../assets/close-icon.svg'
import profileIcon from '../../assets/profile-icon.svg'
import SideMenue from '../SideMenue/SideMenue'

const Navbar = ({ removed = false }) => {
    const [open, setOpen] = useState(true);
    const [side, setSide] = useState(false);
    return (
        <>
            <SideMenue display={side} />
            <div className={style.container}>
                <img src={logo} alt="logo" />
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
                    <img src={favoriteIcon} alt="favorite-icon" />
                    <img src={cartIcon} alt="cart-icon" />
                    <img src={profileIcon} alt="profile-icon" />
                </div>}
                {!removed && <div className={style.menu}>
                    {open 
                    ? <img onClick={() => {setOpen(!open); setSide(!side)}} src={menueIcon} />
                    : <img onClick={() => {setOpen(!open); setSide(!side)}} src={closeIcon} />
                    }
                </div>}
            </div>
        </>
    )
}

export default Navbar
