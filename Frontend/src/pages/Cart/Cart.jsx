import style from './Cart.module.css'
import NavBar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

/* ─── Inline Confirm Popup ───────────────────────────────────── */
const RemoveConfirmPopup = ({ onConfirm, onCancel }) => (
    <div style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        direction: 'rtl'
    }}>
        <div style={{
            backgroundColor: '#060F2C',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '32px 28px',
            width: '320px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
            {/* Icon */}
            <div style={{
                width: '56px', height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(235,142,30,0.15)',
                border: '2px solid #EB8E1E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.6rem'
            }}>
                🗑️
            </div>

            <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>إزالة المنتج</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '24px' }}>
                هل أنت متأكد أنك تريد إزالة هذا المنتج من السلة؟
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={onConfirm} style={{
                    backgroundColor: '#EB8E1E',
                    color: '#060F2C',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 24px',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: '0.2s ease'
                }}
                    onMouseOver={e => e.target.style.opacity = '0.8'}
                    onMouseOut={e => e.target.style.opacity = '1'}
                >
                    نعم
                </button>
                <button onClick={onCancel} style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    padding: '8px 24px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: '0.2s ease'
                }}
                    onMouseOver={e => { e.target.style.borderColor = 'white'; e.target.style.backgroundColor = 'rgba(255,255,255,0.08)' }}
                    onMouseOut={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.backgroundColor = 'transparent' }}
                >
                    إلغاء
                </button>
            </div>
        </div>
    </div>
);

/* ─── Cart ───────────────────────────────────────────────────── */
const Cart = () => {
    const [items, setItems] = useState([]);
    const [pendingRemoveId, setPendingRemoveId] = useState(null);

    const getCart = async () => {
        try {
            const res = await api.get("/cart");
            setItems(res.data.data.items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    const removeItem = async (id) => {
        try {
            await api.delete(`/cart/items/${id}`);
            await getCart();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveClick = (id) => setPendingRemoveId(id);

    const handleConfirmRemove = async () => {
        await removeItem(pendingRemoveId);
        setPendingRemoveId(null);
    };

    const handleCancelRemove = () => setPendingRemoveId(null);

    const increaseQty = async (id, qty) => {
        try {
            await api.patch(`/cart/items/${id}`, { qty: qty + 1 });
            await getCart();
        } catch (error) {
            console.log(error);
        }
    };

    const decreaseQty = async (id, qty) => {
        if (qty === 1) {
            handleRemoveClick(id);
            return;
        }
        try {
            await api.patch(`/cart/items/${id}`, { qty: qty - 1 });
            await getCart();
        } catch (error) {
            console.log(error);
        }
    };

    const totalItems = items.reduce((sum, el) => sum + el.qty, 0);
    const totalPrice = items.reduce((sum, el) => sum + el.qty * el.price, 0);

    return (
        <>
            <NavBar />

            {pendingRemoveId && (
                <RemoveConfirmPopup
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                />
            )}

            <div className={style.page}>
                <h1 className={style.pageTitle}>سلتي</h1>

                {items.length === 0 ? (
                    <div className={style.emptyCart}>
                        <p>🛒 سلتك فارغة</p>
                    </div>
                ) : (
                    <div className={style.layout}>
                        {/* ── Items List ── */}
                        <div className={style.itemsList}>
                            {items.map(el => (
                                <div key={el.product._id} className={style.card}>
                                    <div className={style.cardImage}>
                                        {el.product.image
                                            ? <img src={el.product.image} alt={el.product.name} />
                                            : <span className={style.noImage}>لا توجد صورة</span>
                                        }
                                    </div>

                                    <div className={style.cardInfo}>
                                        <p className={style.cardName}>{el.product.name}</p>
                                        <p className={style.cardPrice}>{el.price} دينار / قطعة</p>
                                        <p className={style.cardTotal}>الإجمالي: {el.qty * el.price} دينار</p>

                                        <div className={style.qtyControls}>
                                            <button className={style.qtyBtn} onClick={() => decreaseQty(el._id, el.qty)}>−</button>
                                            <span className={style.qtyValue}>{el.qty}</span>
                                            <button className={style.qtyBtn} onClick={() => increaseQty(el._id, el.qty)}>+</button>
                                        </div>

                                        <button className={style.removeBtn} onClick={() => handleRemoveClick(el._id)}>
                                            إزالة من السلة
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Summary Panel ── */}
                        <div className={style.summary}>
                            <h2 className={style.summaryTitle}>ملخص الطلب</h2>

                            <div className={style.summaryRow}>
                                <span>عدد المنتجات</span>
                                <span>{items.length} منتج</span>
                            </div>

                            <div className={style.summaryRow}>
                                <span>إجمالي القطع</span>
                                <span>{totalItems} قطعة</span>
                            </div>

                            <hr className={style.summaryDivider} />

                            <div className={style.summaryTotal}>
                                <span>الإجمالي الكلي</span>
                                <span>{totalPrice} دينار</span>
                            </div>

                            <button className={style.checkoutBtn}>
                                إتمام الطلب
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;