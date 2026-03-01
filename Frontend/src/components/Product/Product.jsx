import style from './Product.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from "../../api/axios";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";

const emptyForm = { name: '', price: '', stock: 1, description: '', image: '', category: '' };

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await api.get("/category");
            setCategories(res.data.data);
        } catch (error) { console.log(error); }
    };

    const loadProducts = async () => {
        try {
            const res = await api.get("/product");
            setProducts(res.data.data);
        } catch (error) { console.log(error); }
    };

    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            data
        );

        return res.data.secure_url;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleAdd = () => {
        setFormData(emptyForm);
        setImageFile(null);
        setImagePreview('');
        setError('');
        setShowAddModal(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock ?? 1,
            description: product.description,
            image: product.image,
            category: product.category?._id || product.category || '',
        });
        setImageFile(null);
        setImagePreview(product.image || '');
        setError('');
        setShowEditModal(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setDeleteError('');
        setShowDeleteModal(true);
    };

    const handleSubmit = async (isEdit = false) => {
        if (!formData.name.trim()) return setError('اسم المنتج مطلوب');
        if (!formData.price || isNaN(formData.price)) return setError('السعر مطلوب وجب أن يكون رقماً');
        if (!formData.category) return setError('يجب اختيار المجموعة');

        setLoading(true);
        try {
            let imageUrl = formData.image;

            if (imageFile) {
                setImageLoading(true);
                imageUrl = await uploadToCloudinary(imageFile);
                setImageLoading(false);
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock) || 1,
                image: imageUrl,
            };

            if (isEdit) {
                await api.put(`/product/${selectedProduct._id}`, payload);
                setShowEditModal(false);
            } else {
                await api.post('/product', payload);
                setShowAddModal(false);
            }

            await loadProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ ما');
        } finally {
            setLoading(false);
            setImageLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        setDeleteError('');
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/product/${selectedProduct._id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            await loadProducts();
            setShowDeleteModal(false);
        } catch (err) {
            console.log(err);
            setDeleteError(err.response?.data?.message || 'غير مصرح بحذف هذا المنتج');
        } finally {
            setLoading(false);
        }
    };

    const closeAll = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setError('');
        setDeleteError('');
        setSelectedProduct(null);
    };

    const change = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1>ادارة المنتجات</h1>
                <button onClick={handleAdd}>+ اضافة منتج</button>
            </div>

            <div className={style.cards}>
                {products.map(p => (
                    <div key={p._id} className={style.card}>
                        <div className={style.cardImage}>
                            {p.image
                                ? <img src={p.image} alt={p.name} />
                                : <div className={style.noImage}>لا توجد صورة</div>
                            }
                        </div>
                        <div className={style.cardBody}>
                            <h3>{p.name}</h3>
                            {(p.category?.name || p.category) &&
                                <span className={style.categoryBadge}>
                                    {p.category?.name || p.category}
                                </span>
                            }
                            <p className={style.description}>{p.description}</p>
                            <div className={style.cardMeta}>
                                <span className={style.price}>{p.price} دينار</span>
                                <span className={style.stock}>المخزون: {p.stock ?? 1}</span>
                            </div>
                        </div>
                        <div className={style.cardButtons}>
                            <button className={style.editBtn} onClick={() => handleEdit(p)}>
                                <CiEdit /> تعديل
                            </button>
                            <button className={style.deleteBtn} onClick={() => handleDeleteClick(p)}>
                                <MdDelete /> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <Modal title="اضافة منتج جديد" closeAll={closeAll}>
                    <ProductForm
                        isEdit={false}
                        {...{
                            style,
                            imagePreview,
                            imageLoading,
                            handleImageChange,
                            formData,
                            change,
                            categories,
                            error,
                            closeAll,
                            handleSubmit,
                            loading
                        }}
                    />
                </Modal>
            )}

            {showEditModal && (
                <Modal title="تعديل المنتج" closeAll={closeAll}>
                    <ProductForm
                        isEdit={true}
                        {...{
                            style,
                            imagePreview,
                            imageLoading,
                            handleImageChange,
                            formData,
                            change,
                            categories,
                            error,
                            closeAll,
                            handleSubmit,
                            loading
                        }}
                    />
                </Modal>
            )}

            {showDeleteModal && (
                <div className={style.overlay} onClick={closeAll}>
                    <div className={style.modal} onClick={e => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h2>تأكيد الحذف</h2>
                            <button className={style.closeBtn} onClick={closeAll}>
                                <IoClose size={20} />
                            </button>
                        </div>
                        <div className={style.modalBody}>
                            <p>هل أنت متأكد من حذف المنتج <strong>{selectedProduct?.name}</strong>؟</p>
                            {deleteError && <p className={style.error}>{deleteError}</p>}
                        </div>
                        <div className={style.modalFooter}>
                            <button className={style.cancelBtn} onClick={closeAll}>الغاء</button>
                            <button
                                className={style.deleteBtnModal}
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                            >
                                {loading ? 'جاري الحذف...' : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Modal = ({ title, closeAll, children }) => (
    <div className={style.overlay} onClick={closeAll}>
        <div className={style.modal} onClick={e => e.stopPropagation()}>
            <div className={style.modalHeader}>
                <h2>{title}</h2>
                <button className={style.closeBtn} onClick={closeAll}>
                    <IoClose size={20} />
                </button>
            </div>
            {children}
        </div>
    </div>
);

const ProductForm = ({
    isEdit,
    style,
    imagePreview,
    imageLoading,
    handleImageChange,
    formData,
    change,
    categories,
    error,
    closeAll,
    handleSubmit,
    loading
}) => (
    <>
        <div className={style.modalBody}>
            <div className={style.imageUpload}>
                <div className={style.imagePreview}>
                    {imagePreview
                        ? <img src={imagePreview} alt="preview" />
                        : <span>لا توجد صورة</span>
                    }
                </div>
                <label className={style.uploadLabel}>
                    <FiUpload size={16} />
                    {imageLoading ? 'جاري الرفع...' : 'رفع صورة'}
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
            </div>

            <div className={style.formRow}>
                <div className={style.formGroup}>
                    <label>اسم المنتج</label>
                    <input name="name" value={formData.name} onChange={change} />
                </div>
                <div className={style.formGroup}>
                    <label>السعر</label>
                    <input name="price" type="number" value={formData.price} onChange={change} />
                </div>
            </div>

            <div className={style.formRow}>
                <div className={style.formGroup}>
                    <label>المخزون</label>
                    <input name="stock" type="number" value={formData.stock} onChange={change} />
                </div>
                <div className={style.formGroup}>
                    <label>المجموعة</label>
                    <select name="category" value={formData.category} onChange={change}>
                        <option value="">-- اختر المجموعة --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={style.formGroup}>
                <label>الوصف</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={change}
                    rows={3}
                />
            </div>

            {error && <p className={style.error}>{error}</p>}
        </div>

        <div className={style.modalFooter}>
            <button className={style.cancelBtn} onClick={closeAll}>الغاء</button>
            <button
                className={style.confirmBtn}
                onClick={() => handleSubmit(isEdit)}
                disabled={loading || imageLoading}
            >
                {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'اضافة'}
            </button>
        </div>
    </>
);

export default Product;