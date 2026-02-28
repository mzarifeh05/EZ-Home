import style from './Category.module.css'
import api from '../../api/axios'
import { useState, useEffect } from 'react';
import { BiCategory } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await api.get("/category");
            setCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAdd = () => {
        setFormData({ name: '' });
        setError('');
        setShowAddModal(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name });
        setError('');
        setShowEditModal(true);
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const handleAddSubmit = async () => {
        if (!formData.name.trim()) {
            setError('اسم المجموعة مطلوب');
            return;
        }
        setLoading(true);
        try {
            await api.post("/category", formData);
            await loadCategories();
            setShowAddModal(false);
            setFormData({ name: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ ما');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!formData.name.trim()) {
            setError('اسم المجموعة مطلوب');
            return;
        }
        setLoading(true);
        try {
            await api.put(`/category/${selectedCategory._id}`, formData);
            await loadCategories();
            setShowEditModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ ما');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await api.delete(`/category/${selectedCategory._id}`);
            await loadCategories();
            setShowDeleteModal(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const closeAll = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setError('');
        setSelectedCategory(null);
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1>ادارة المجموعات</h1>
                <button onClick={handleAdd}>+ اضافة مجموعة</button>
            </div>

            <div className={style.cards}>
                {categories.map(Element =>
                    <div key={Element._id}>
                        <p>
                            <BiCategory size={20} color='#EB8E1E' />
                        </p>
                        <h3>{Element.name}</h3>
                        <div className={style.buttons}>
                            <button onClick={() => handleEdit(Element)}>
                                <CiEdit />
                                تعديل
                            </button>
                            <button onClick={() => handleDeleteClick(Element)}>
                                <MdDelete />
                                حذف
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className={style.overlay} onClick={closeAll}>
                    <div className={style.modal} onClick={e => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h2>اضافة مجموعة جديدة</h2>
                            <button className={style.closeBtn} onClick={closeAll}>
                                <IoClose size={20} />
                            </button>
                        </div>
                        <div className={style.modalBody}>
                            <label>اسم المجموعة</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ادخل اسم المجموعة"
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                            />
                            {error && <p className={style.error}>{error}</p>}
                        </div>
                        <div className={style.modalFooter}>
                            <button className={style.cancelBtn} onClick={closeAll}>الغاء</button>
                            <button className={style.confirmBtn} onClick={handleAddSubmit} disabled={loading}>
                                {loading ? 'جاري الحفظ...' : 'اضافة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className={style.overlay} onClick={closeAll}>
                    <div className={style.modal} onClick={e => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h2>تعديل المجموعة</h2>
                            <button className={style.closeBtn} onClick={closeAll}>
                                <IoClose size={20} />
                            </button>
                        </div>
                        <div className={style.modalBody}>
                            <label>اسم المجموعة</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ادخل اسم المجموعة"
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleEditSubmit()}
                            />
                            {error && <p className={style.error}>{error}</p>}
                        </div>
                        <div className={style.modalFooter}>
                            <button className={style.cancelBtn} onClick={closeAll}>الغاء</button>
                            <button className={style.confirmBtn} onClick={handleEditSubmit} disabled={loading}>
                                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
                            <p className={style.deleteMessage}>
                                هل أنت متأكد من حذف مجموعة <strong>"{selectedCategory?.name}"</strong>؟
                                <br />
                                لا يمكن التراجع عن هذا الإجراء.
                            </p>
                        </div>
                        <div className={style.modalFooter}>
                            <button className={style.cancelBtn} onClick={closeAll}>الغاء</button>
                            <button className={style.deleteBtn} onClick={handleDeleteConfirm} disabled={loading}>
                                {loading ? 'جاري الحذف...' : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;