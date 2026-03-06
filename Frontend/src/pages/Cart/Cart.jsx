import style from './Cart.module.css'
import NavBar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import phoneIcon from '../../assets/phone-icon.svg'
import personIcon from '../../assets/person-icon.svg'
import { MdOutlineShoppingBag, MdDeleteOutline } from 'react-icons/md'
import { CiEdit } from 'react-icons/ci'
import { BsBoxSeam, BsCheckCircle, BsClock, BsXCircle } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { FiMapPin } from 'react-icons/fi'

const JORDAN_CITIES = [
    'عمّان', 'الزرقاء', 'إربد', 'العقبة', 'السلط',
    'مادبا', 'الكرك', 'الطفيلة', 'معان', 'رام الله',
    'جرش', 'عجلون', 'المفرق', 'الرمثا', 'الأزرق',
    'الحسن', 'الشوبك', 'وادي موسى', 'الجيزة', 'ماركا',
    'الرصيفة', 'الوحدات', 'سحاب', 'الجويدة', 'ناعور',
    'أبو نصير', 'تلاع العلي', 'شفا بدران', 'الهاشمية', 'الأغوار الشمالية',
];

const STATUS_MAP = {
    pending:   { label: 'قيد الانتظار', color: '#D97706', bg: 'rgba(217,119,6,0.1)',  Icon: BsClock      },
    paid:      { label: 'تم الاستلام',        color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   Icon: BsCheckCircle },
    cancelled: { label: 'ملغي',         color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   Icon: BsXCircle    },
};

const formatDate = (d) => new Date(d).toLocaleDateString('ar-JO', {
    year: 'numeric', month: 'long', day: 'numeric',
});

/* ─── Remove Confirm Popup ───────────────────────────────────── */
const RemoveConfirmPopup = ({ onConfirm, onCancel }) => (
    <div className={style.popupOverlay} style={{ zIndex: 10000 }}>
        <div className={`${style.popup} ${style.popupCenter}`}>
            <div className={style.popupIconWrap} style={{ borderColor: '#dc2626' }}>
                <MdDeleteOutline size={28} color="#dc2626" />
            </div>
            <h2 className={style.popupTitle}>إزالة المنتج</h2>
            <p className={style.popupSubtitle}>هل أنت متأكد أنك تريد إزالة هذا المنتج من السلة؟</p>
            <div className={style.popupActions}>
                <button className={`${style.popupConfirmBtn} ${style.popupDangerBtn}`} onClick={onConfirm}>نعم، إزالة</button>
                <button className={style.popupCancelBtn} onClick={onCancel}>إلغاء</button>
            </div>
        </div>
    </div>
);

/* ─── Checkout Popup ─────────────────────────────────────────── */
const CheckoutPopup = ({ totalPrice, onConfirm, onCancel }) => {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleConfirm = async () => {
        if (!city) { setError('الرجاء اختيار المدينة'); return; }
        setLoading(true); setError('');
        try {
            await api.post('/order', { city });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إتمام الطلب');
        } finally { setLoading(false); }
    };

    if (success) return (
        <div className={style.popupOverlay}>
            <div className={`${style.popup} ${style.popupCenter}`}>
                <div className={style.successIconWrap}>
                    <BsCheckCircle size={30} color="#16a34a" />
                </div>
                <h2 className={style.popupTitle}>تم الطلب بنجاح!</h2>
                <p className={style.popupSubtitle}>شكراً لك، سيتم التواصل معك قريباً لتأكيد طلبك.</p>
                <button className={style.popupConfirmBtn} onClick={onConfirm}>حسناً</button>
            </div>
        </div>
    );

    return (
        <div className={style.popupOverlay}>
            <div className={style.popup}>
                <div className={style.popupHeader}>
                    <div className={style.popupHeaderTitle}>
                        <div className={style.popupIconWrap}><MdOutlineShoppingBag size={24} color="#EB8E1E" /></div>
                        <h2 className={style.popupTitle}>إتمام الطلب</h2>
                    </div>
                    <button className={style.popupCloseBtn} onClick={onCancel}><IoClose size={20} /></button>
                </div>

                <p className={style.popupTotalLine}>
                    الإجمالي الكلي: <strong className={style.popupTotalVal}>{totalPrice} دينار</strong>
                </p>

                <div className={style.popupField}>
                    <label className={style.popupLabel}>
                        <FiMapPin size={14} /> اختر مدينتك
                    </label>
                    <select className={style.popupSelect} value={city}
                        onChange={e => { setCity(e.target.value); setError(''); }}>
                        <option value="">-- اختر المدينة --</option>
                        {JORDAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {error && <p className={style.popupError}>{error}</p>}
                </div>

                <div className={style.popupActions}>
                    <button className={style.popupConfirmBtn} onClick={handleConfirm} disabled={loading}>
                        {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                    </button>
                    <button className={style.popupCancelBtn} onClick={onCancel} disabled={loading}>إلغاء</button>
                </div>
            </div>
        </div>
    );
};

/* ─── My Orders Popup ────────────────────────────────────────── */
const MyOrdersPopup = ({ onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/order/my');
                setOrders(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'تعذّر تحميل الطلبات');
            } finally { setLoading(false); }
        })();
    }, []);

    return (
        <div className={style.popupOverlay}>
            <div className={`${style.popup} ${style.popupWide}`}>
                <div className={style.popupHeader}>
                    <div className={style.popupHeaderTitle}>
                        <div className={style.popupIconWrap}><BsBoxSeam size={20} color="#EB8E1E" /></div>
                        <h2 className={style.popupTitle}>طلباتي السابقة</h2>
                    </div>
                    <button className={style.popupCloseBtn} onClick={onClose}><IoClose size={20} /></button>
                </div>

                <div className={style.ordersBody}>
                    {loading && <p className={style.popupLoadingText}>جاري التحميل...</p>}
                    {error && <p className={style.popupError} style={{ textAlign: 'center' }}>{error}</p>}
                    {!loading && !error && orders.length === 0 && (
                        <p className={style.popupLoadingText}>لا توجد طلبات سابقة</p>
                    )}
                    {!loading && orders.map(order => {
                        const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
                        return (
                            <div key={order._id} className={style.orderCard}>
                                <div className={style.orderCardTop}>
                                    <span className={style.orderIdBadge}>#{order._id.slice(-6).toUpperCase()}</span>
                                    <span className={style.orderStatusBadge} style={{ color: st.color, backgroundColor: st.bg }}>
                                        <st.Icon size={12} />
                                        {st.label}
                                    </span>
                                </div>
                                <div className={style.orderCardMeta}>
                                    <span className={style.orderDate}>{formatDate(order.createdAt)}</span>
                                    <span className={style.orderTotal}>{order.total} دينار</span>
                                </div>
                                <span className={style.orderItemCount}>
                                    <BsBoxSeam size={12} />
                                    {order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <button className={style.popupCancelBtn} onClick={onClose}>إغلاق</button>
            </div>
        </div>
    );
};

/* ─── Edit Profile Popup ─────────────────────────────────────── */
const EditProfilePopup = ({ onClose }) => {
    const token = localStorage.getItem('token') || '';
    let userId = '';
    try { userId = JSON.parse(atob(token.split('.')[1]))._id; } catch (_) {}

    const [form, setForm] = useState({ fullName: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill with current user data
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/auth');
                const user = res.data.data;
                // Strip the 00962 prefix from phone for the input
                const rawPhone = user.phone?.startsWith('00962')
                    ? user.phone.slice(5)
                    : user.phone || '';
                setForm({ fullName: user.fullName || '', phone: rawPhone });
            } catch (err) {
                setError('تعذّر تحميل بياناتك');
            } finally { setLoading(false); }
        })();
    }, []);

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val === '' || (/^\d+$/.test(val) && val.length <= 9))
            setForm(f => ({ ...f, phone: val }));
    };

    const handleSubmit = async () => {
        if (!form.fullName.trim()) { setError('الرجاء إدخال الاسم الكامل'); return; }
        if (form.phone && form.phone.length !== 9) { setError('رقم الهاتف يجب أن يتكون من 9 أرقام'); return; }
        setSaving(true); setError('');
        try {
            const payload = { fullName: form.fullName };
            if (form.phone) payload.phone = `00962${form.phone}`;
            await api.put(`/auth/update/${userId}`, payload);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء التحديث');
        } finally { setSaving(false); }
    };

    if (success) return (
        <div className={style.popupOverlay}>
            <div className={`${style.popup} ${style.popupCenter}`}>
                <div className={style.successIconWrap}>
                    <BsCheckCircle size={30} color="#16a34a" />
                </div>
                <h2 className={style.popupTitle}>تم التحديث بنجاح!</h2>
                <p className={style.popupSubtitle}>تم حفظ بياناتك الجديدة.</p>
                <button className={style.popupConfirmBtn} onClick={onClose}>حسناً</button>
            </div>
        </div>
    );

    return (
        <div className={style.popupOverlay}>
            <div className={style.popup}>
                <div className={style.popupHeader}>
                    <div className={style.popupHeaderTitle}>
                        <div className={style.popupIconWrap}><CiEdit size={22} color="#EB8E1E" /></div>
                        <h2 className={style.popupTitle}>تعديل البيانات</h2>
                    </div>
                    <button className={style.popupCloseBtn} onClick={onClose}><IoClose size={20} /></button>
                </div>

                {loading ? (
                    <p className={style.popupLoadingText}>جاري التحميل...</p>
                ) : (
                    <>
                        <div className={style.popupField}>
                            <label className={style.popupLabel} htmlFor="edit-name">الاسم الكامل</label>
                            <div className={style.inputBox}>
                                <div className={style.iconOnly}>
                                    <img src={personIcon} alt="name" />
                                </div>
                                <input
                                    id="edit-name"
                                    dir="rtl"
                                    type="text"
                                    placeholder="أدخل اسمك الكامل"
                                    value={form.fullName}
                                    onChange={e => { setForm(f => ({ ...f, fullName: e.target.value })); setError(''); }}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className={style.popupField}>
                            <label className={style.popupLabel} htmlFor="edit-phone">رقم الهاتف</label>
                            <div className={style.inputBox}>
                                <div className={style.prefix}>
                                    <img src={phoneIcon} alt="phone" />
                                    <span>+962</span>
                                </div>
                                <input
                                    id="edit-phone"
                                    dir="ltr"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="7XXXXXXXX"
                                    value={form.phone}
                                    onChange={handlePhoneChange}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        {error && <p className={style.popupError}>{error}</p>}

                        <div className={style.popupActions}>
                            <button className={style.popupConfirmBtn} onClick={handleSubmit} disabled={saving}>
                                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                            <button className={style.popupCancelBtn} onClick={onClose} disabled={saving}>إلغاء</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── Cart ───────────────────────────────────────────────────── */
const Cart = () => {
    const [items, setItems] = useState([]);
    const [pendingRemoveId, setPendingRemoveId] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate = useNavigate();

    const getCart = async () => {
        try {
            const res = await api.get('/cart');
            setItems(res.data.data.items);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login');
        window.scrollTo(0, 0);
        getCart();
    }, []);

    const removeItem = async (id) => {
        try { await api.delete(`/cart/items/${id}`); await getCart(); }
        catch (error) { console.error(error); }
    };

    const handleRemoveClick = (id) => setPendingRemoveId(id);
    const handleConfirmRemove = async () => { await removeItem(pendingRemoveId); setPendingRemoveId(null); };
    const handleCancelRemove = () => setPendingRemoveId(null);

    const increaseQty = async (id, qty) => {
        try { await api.patch(`/cart/items/${id}`, { qty: qty + 1 }); await getCart(); }
        catch (error) { console.log(error); }
    };

    const decreaseQty = async (id, qty) => {
        if (qty === 1) { handleRemoveClick(id); return; }
        try { await api.patch(`/cart/items/${id}`, { qty: qty - 1 }); await getCart(); }
        catch (error) { console.log(error); }
    };

    const handleOrderSuccess = async () => { setShowCheckout(false); await getCart(); };

    const totalItems = items.reduce((sum, el) => sum + el.qty, 0);
    const totalPrice = items.reduce((sum, el) => sum + el.qty * el.price, 0);

    return (
        <>
            <NavBar />

            {pendingRemoveId && <RemoveConfirmPopup onConfirm={handleConfirmRemove} onCancel={handleCancelRemove} />}
            {showCheckout && <CheckoutPopup totalPrice={totalPrice} onConfirm={handleOrderSuccess} onCancel={() => setShowCheckout(false)} />}
            {showOrders && <MyOrdersPopup onClose={() => setShowOrders(false)} />}
            {showEditProfile && <EditProfilePopup onClose={() => setShowEditProfile(false)} />}

            <div className={style.page}>
                {/* ── Page Header ── */}
                <div className={style.pageHeader}>
                    <h1 className={style.pageTitle}>سلتي</h1>
                    <div className={style.headerActions}>
                        <button className={style.headerBtn} onClick={() => setShowOrders(true)}>
                            <BsBoxSeam size={16} />
                            طلباتي
                        </button>
                        <button className={style.headerBtn} onClick={() => setShowEditProfile(true)}>
                            <CiEdit size={18} />
                            تعديل البيانات
                        </button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className={style.emptyCart}>
                        <MdOutlineShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>سلتك فارغة</p>
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
                                            <MdDeleteOutline size={15} />
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
                            <button className={style.checkoutBtn} onClick={() => setShowCheckout(true)}>
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