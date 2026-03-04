import React, { useState, useEffect } from 'react'
import style from './Card.module.css'
import filledHeart from '../../assets/filled-favorite-icon.svg'
import unfilledHeart from '../../assets/unfilled-heart-icon.svg'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const Toast = ({ message, type }) => {
    if (!message) return null;
    return (
        <div className={`${style.toast} ${type === 'success' ? style.toastSuccess : style.toastError}`}>
            {message}
        </div>
    );
};

const Card = ({ img, title, price, description, id, wishlistIds, forceFavorite, onRemove }) => {
    const [favorite, setFavorite] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        if (forceFavorite) {
            setFavorite(true);
        } else if (wishlistIds?.includes(id)) {
            setFavorite(true);
        } else {
            setFavorite(false);
        }
    }, [wishlistIds, id, forceFavorite]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const addToCart = async () => {
        if (localStorage.getItem("role") !== "user") {
            showToast("يجب تسجيل الدخول أولاً", "error");
            return;
        }

        try {
            const res = await api.post("/cart/items", {
                productId: id,
                qty: 1,
                price: price
            });
            console.log(res.data);
            showToast("✓ تمت الإضافة إلى السلة", "success");
        } catch (error) {
            console.log(error);
            showToast("حدث خطأ، حاول مرة أخرى", "error");
        }
    };

    const addToFavorite = async () => {
        try {
            await api.post("/wishlist/items", {
                productId: id
            });
            console.log("added");
        }
        catch (error) {
            console.error(error)
        }
    }

    const removeFromFavorite = async () => {
        try {
            await api.delete(`/wishlist/items/${id}`);
            if (onRemove) {
                onRemove(id);
            }   
            console.log("removed");
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Toast message={toast.message} type={toast.type} />
            <div className={style.container}>
                <div className={style.upper}>
                    <p>
                        {favorite ?
                            <img onClick={() => { setFavorite(!favorite); removeFromFavorite() }} src={filledHeart} alt="favorite-icon" />
                            :
                            <img onClick={() => { setFavorite(!favorite); addToFavorite() }} src={unfilledHeart} alt="favorite-icon" />
                        }
                    </p>
                    {img ?
                        <img src={img} alt="" />
                        :
                        <div className={style.noImage}>no image preview</div>
                    }
                </div>
                <div className={style.lower}>
                    <h2>{title}</h2>
                    <h3>{price} دينار</h3>
                    <p>{description}</p>
                    <div className={style.actions}>
                        <Link className={style.a} to={`/DetailsCard/${id}`}>المزيد</Link>
                        <button onClick={addToCart}>أضف إلى السلة</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Card;