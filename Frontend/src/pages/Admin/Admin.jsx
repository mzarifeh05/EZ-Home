import style from './Admin.module.css'
import NavBar from '../../components/Navbar/Navbar'
import Category from '../../components/Category/Category'
import Product from '../../components/Product/Product'
import { MdAdminPanelSettings } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { MdNotificationsActive } from "react-icons/md";
import { useState } from 'react';

const Admin = () => {
    const [display, setDisplay] = useState("categories")

    return (
        <>
            <NavBar />
            <div className={style.container}>
                <div className={style.sideMenu}>

                    <h1>
                        <MdAdminPanelSettings size={32} color="#EB8E1E" />
                        لوحة التحكم
                    </h1>
                    <p onClick={() => setDisplay("categories")}>
                        <BiCategory size={20} />
                        ادارة المجموعات
                    </p>
                    <p onClick={() => setDisplay("products")}>
                        <FiShoppingBag size={20} />
                        ادارة المنتجات
                    </p>
                    <p>
                        <MdNotificationsActive size={20} />
                        ادارة الطلبات
                    </p>
                </div>
                {display === "categories" && <Category/>}
                {display === "products" && <Product/>}
            </div>
        </>
    )
}

export default Admin
