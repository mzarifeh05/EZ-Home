import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import style from "./DetailsCard.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Card from "../Card/Card";
import api from "../../api/axios";

const DetailsCard = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [qty, setQty] = useState(1);
    const [toast, setToast] = useState({ message: "", type: "" });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!id) return;

        const loadProduct = async () => {
            try {
                // Now this will correctly hit /product/123 instead of /product/undefined
                const res = await api.get(`/product/${id}`);
                const prod = res.data.data;
                setProduct(prod);

                // Load related products from same category
                const allRes = await api.get("/product");
                const all = allRes.data.data;
                setRelated(
                    all.filter(
                        (p) =>
                            p._id !== prod._id &&
                            p.category?.name === prod.category?.name
                    )
                );
            } catch (error) {
                console.error(error);
            }
        };
        loadProduct();
    }, [id]);

    const addToCart = async () => {
        if (localStorage.getItem("role") !== "user") {
            showToast("يجب تسجيل الدخول أولاً", "error");
            return;
        }
        try {
            await api.post("/cart/items", {
                productId: product._id,
                qty,
                price: product.price,
            });
            showToast("✓ تمت الإضافة إلى السلة", "success");
        } catch (error) {
            console.error(error);
            showToast("حدث خطأ، حاول مرة أخرى", "error");
        }
    };

    if (!product) {
        return (
            <>
                <Navbar />
                <div className={style.loading}>جاري التحميل...</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            {/* Toast */}
            {toast.message && (
                <div className={`${style.toast} ${toast.type === "success" ? style.toastSuccess : style.toastError}`}>
                    {toast.message}
                </div>
            )}

            <div className={style.page} dir="rtl">

                {/* ── Hero Section ── */}
                <section className={style.hero}>

                    {/* Image Panel */}
                    <div className={style.imagePanel}>
                        <div className={style.imageWrapper}>
                            {product.image
                                ? <img src={product.image} alt={product.name} className={style.productImage} />
                                : <div className={style.noImage}>لا توجد صورة</div>
                            }
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className={style.infoPanel}>
                        <p className={style.category}>{product.category?.name}</p>
                        <h1 className={style.title}>{product.name}</h1>
                        <p className={style.price}>{product.price} دينار</p>
                        <p className={style.description}>{product.description}</p>

                        {/* Qty Selector */}
                        <div className={style.qtyRow}>
                            <span className={style.qtyLabel}>الكمية</span>
                            <div className={style.qtyControls}>
                                <button className={style.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                                <span className={style.qtyValue}>{qty}</span>
                                <button className={style.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={style.actions}>
                            <button className={style.cartBtn} onClick={addToCart}>
                                أضف إلى السلة
                            </button>
                        </div>

                    </div>
                </section>

                {/* ── Related Products ── */}
                {related.length > 0 && (
                    <section className={style.related}>
                        <div className={style.relatedHeader}>
                            <h2 className={style.relatedTitle}>منتجات مشابهة</h2>
                            <div className={style.relatedLine} />
                        </div>
                        <div className={style.relatedGrid}>
                            {related.map(p => (
                                <Card
                                    key={p._id}
                                    id={p._id}
                                    title={p.name}
                                    img={p.image}
                                    price={p.price}
                                    description={p.description}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </>
    );
};

export default DetailsCard;