import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Admin.module.css';
import NavBar from '../../components/Navbar/Navbar';
import Category from '../../components/Category/Category';
import Product from '../../components/Product/Product';
import Order from '../../components/Order/Order';
import { MdAdminPanelSettings, MdNotificationsActive } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";

const Admin = () => {
    const [display, setDisplay] = useState("orders");
    const [navVisible, setNavVisible] = useState(true); // Track navbar visibility
    const lastScrollY = useRef(0);
    const navigate = useNavigate();

    // Route protection
    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole !== "admin") {
            navigate("/");
        }
    }, [navigate]);

    // Scroll listener to sync sidebar with the Navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
                return;
            }

            if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
                setNavVisible(true); // Navbar is showing
            } else {
                setNavVisible(false); // Navbar is hiding
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={style.pageWrapper}>
            <NavBar />
            <div className={style.container}>
                {/* Apply dynamic classes based on navVisible state */}
                <aside className={`${style.sideMenu} ${navVisible ? style.sideMenuDown : style.sideMenuUp}`}>
                    <h1 className={style.brand}>
                        <MdAdminPanelSettings size={32} color="#EB8E1E" />
                        <span className={style.brandText}>لوحة التحكم</span>
                    </h1>

                    <nav className={style.navLinks}>
                        <button className={`${style.navButton} ${display === "orders" ? style.active : ""}`}
                            onClick={() => setDisplay("orders")}
                        >
                            <MdNotificationsActive size={20} />
                            <span className={style.linkText}>ادارة الطلبات</span>
                        </button>

                        <button
                            className={`${style.navButton} ${display === "products" ? style.active : ""}`}
                            onClick={() => setDisplay("products")}
                        >
                            <FiShoppingBag size={20} />
                            <span className={style.linkText}>ادارة المنتجات</span>
                        </button>

                        <button
                            className={`${style.navButton} ${display === "categories" ? style.active : ""}`}
                            onClick={() => setDisplay("categories")}
                        >
                            <BiCategory size={20} />
                            <span className={style.linkText}>ادارة المجموعات</span>
                        </button>
                    </nav>
                </aside>

                <main className={style.mainContent}>
                    {display === "categories" && <Category />}
                    {display === "products" && <Product />}
                    {display === "orders" && <Order />}
                </main>
            </div>
        </div>
    );
};

export default Admin;