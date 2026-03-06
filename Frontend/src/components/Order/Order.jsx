import style from './Order.module.css'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { IoClose, IoPersonOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag, MdAccessTime } from 'react-icons/md'
import { BsBoxSeam, BsCheckCircle, BsClock } from 'react-icons/bs'
import { FiRefreshCw } from 'react-icons/fi'

const statusMap = {
    pending: { label: 'قيد الانتظار', className: 'pending' },
    paid: { label: 'مدفوع', className: 'paid' },
    cancelled: { label: 'ملغي', className: 'cancelled' },
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-JO', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrders(); }, []);

    useEffect(() => {
        setFiltered(statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter));
    }, [statusFilter, orders]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/order/admin/all');
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setStatusLoading(true);
        setStatusError('');
        try {
            await api.patch(`/order/admin/${orderId}/status`, { status: newStatus });
            await loadOrders();
            setSelectedOrder(prev =>
                prev?._id === orderId ? { ...prev, status: newStatus } : prev
            );
        } catch (err) {
            setStatusError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة');
        } finally {
            setStatusLoading(false);
        }
    };

    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid: orders.filter(o => o.status === 'paid').length,
    };

    const openDetail = (order) => { setSelectedOrder(order); setStatusError(''); };

    return (
        <div className={style.container}>
            {/* Header */}
            <div className={style.header}>
                <h1>إدارة الطلبات</h1>
                <button className={style.refreshBtn} onClick={loadOrders}>
                    <FiRefreshCw size={16} /> تحديث
                </button>
            </div>

            {/* Stats Bar */}
            <div className={style.statsBar}>
                <div className={style.statCard}>
                    <MdOutlineShoppingBag size={22} className={style.statIcon} />
                    <div><span className={style.statNum}>{counts.all}</span><span className={style.statLabel}>إجمالي الطلبات</span></div>
                </div>
                <div className={`${style.statCard} ${style.statPending}`}>
                    <BsClock size={20} className={style.statIcon} />
                    <div><span className={style.statNum}>{counts.pending}</span><span className={style.statLabel}>قيد الانتظار</span></div>
                </div>
                <div className={`${style.statCard} ${style.statPaid}`}>
                    <BsCheckCircle size={20} className={style.statIcon} />
                    <div><span className={style.statNum}>{counts.paid}</span><span className={style.statLabel}>مدفوع</span></div>
                </div>
                <div className={style.statCard}>
                    <BsBoxSeam size={20} className={style.statIcon} />
                    <div>
                        <span className={style.statNum}>{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString('ar-JO')} د.أ</span>
                        <span className={style.statLabel}>إجمالي الإيرادات</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={style.filterBar}>
                <span className={style.filterLabel}>تصفية:</span>
                <div className={style.filterBtns}>
                    {[
                        { key: 'all', label: `الكل (${counts.all})` },
                        { key: 'pending', label: `انتظار (${counts.pending})` },
                        { key: 'paid', label: `مدفوع (${counts.paid})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`${style.filterBtn} ${statusFilter === f.key ? style.activeFilter : ''} ${f.key !== 'all' ? style[`filter_${f.key}`] : ''}`}
                            onClick={() => setStatusFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className={style.emptyState}>جاري التحميل...</div>
            ) : filtered.length === 0 ? (
                <div className={style.emptyState}>لا توجد طلبات</div>
            ) : (
                <>
                    {/* ── Desktop Table ── */}
                    <div className={style.tableWrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>رقم الطلب</th>
                                    <th>العميل</th>
                                    <th>المدينة</th>
                                    <th>التاريخ</th>
                                    <th>المنتجات</th>
                                    <th>الإجمالي</th>
                                    <th>الحالة</th>
                                    <th>تغيير الحالة</th>
                                    <th>التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <tr key={order._id} className={style.tableRow}>
                                        <td className={style.orderId}>#{order._id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div className={style.customerCell}>
                                                <span className={style.customerName}>{order.customer?.fullName}</span>
                                                <span className={style.customerPhone}>{order.customer?.phone}</span>
                                            </div>
                                        </td>
                                        <td>{order.customer?.city || '—'}</td>
                                        <td>
                                            <div className={style.dateCell}>
                                                <MdAccessTime size={13} />{formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td className={style.itemsCount}>{order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}</td>
                                        <td className={style.totalCell}>{order.total.toLocaleString('ar-JO')} د.أ</td>
                                        <td>
                                            <span className={`${style.statusBadge} ${style[statusMap[order.status]?.className || 'pending']}`}>
                                                {statusMap[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.status === 'pending' && <button className={style.markPaidBtn} onClick={() => handleStatusChange(order._id, 'paid')} disabled={statusLoading}>تحديد كمدفوع</button>}
                                            {order.status === 'paid' && <button className={style.markPendingBtn} onClick={() => handleStatusChange(order._id, 'pending')} disabled={statusLoading}>إعادة للانتظار</button>}
                                        </td>
                                        <td>
                                            <button className={style.detailsBtn} onClick={() => openDetail(order)}>عرض</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Cards ── */}
                    <div className={style.mobileCards}>
                        {filtered.map(order => (
                            <div key={order._id} className={style.mobileCard}>
                                <div className={style.mobileCardTop}>
                                    <span className={style.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                                    <span className={`${style.statusBadge} ${style[statusMap[order.status]?.className || 'pending']}`}>
                                        {statusMap[order.status]?.label || order.status}
                                    </span>
                                </div>

                                <div className={style.mobileCardInfo}>
                                    <div className={style.mobileInfoRow}>
                                        <IoPersonOutline size={14} />
                                        <span className={style.customerName}>{order.customer?.fullName}</span>
                                    </div>
                                    <div className={style.mobileInfoRow}>
                                        <IoCallOutline size={14} />
                                        <span dir="ltr">{order.customer?.phone}</span>
                                    </div>
                                    <div className={style.mobileInfoRow}>
                                        <IoLocationOutline size={14} />
                                        <span>{order.customer?.city || '—'}</span>
                                    </div>
                                    <div className={style.mobileInfoRow}>
                                        <MdAccessTime size={14} />
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                </div>

                                <div className={style.mobileCardFooter}>
                                    <div className={style.mobileCardMeta}>
                                        <span className={style.mobileItemCount}>
                                            <BsBoxSeam size={13} />
                                            {order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}
                                        </span>
                                        <span className={style.totalCell}>{order.total.toLocaleString('ar-JO')} د.أ</span>
                                    </div>
                                    <div className={style.mobileCardActions}>
                                        {order.status === 'pending' && <button className={style.markPaidBtn} onClick={() => handleStatusChange(order._id, 'paid')} disabled={statusLoading}>تحديد كمدفوع</button>}
                                        {order.status === 'paid' && <button className={style.markPendingBtn} onClick={() => handleStatusChange(order._id, 'pending')} disabled={statusLoading}>إعادة للانتظار</button>}
                                        <button className={style.detailsBtn} onClick={() => openDetail(order)}>عرض التفاصيل</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className={style.overlay} onClick={() => setSelectedOrder(null)}>
                    <div className={style.modal} onClick={e => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h2>
                                تفاصيل الطلب
                                <span className={style.modalOrderId}>#{selectedOrder._id.slice(-6).toUpperCase()}</span>
                            </h2>
                            <button className={style.closeBtn} onClick={() => setSelectedOrder(null)}>
                                <IoClose size={20} />
                            </button>
                        </div>

                        <div className={style.modalBody}>
                            <div className={style.section}>
                                <h3 className={style.sectionTitle}><IoPersonOutline size={16} /> معلومات العميل</h3>
                                <div className={style.infoGrid}>
                                    <div className={style.infoItem}><IoPersonOutline size={14} /><span>{selectedOrder.customer?.fullName}</span></div>
                                    <div className={style.infoItem}><IoCallOutline size={14} /><span dir="ltr">{selectedOrder.customer?.phone}</span></div>
                                    <div className={style.infoItem}><IoLocationOutline size={14} /><span>{selectedOrder.customer?.city}</span></div>
                                    <div className={style.infoItem}><MdAccessTime size={14} /><span>{formatDate(selectedOrder.createdAt)}</span></div>
                                </div>
                            </div>

                            <div className={style.section}>
                                <h3 className={style.sectionTitle}><BsClock size={15} /> حالة الطلب</h3>
                                <div className={style.statusRow}>
                                    <span className={`${style.statusBadge} ${style[statusMap[selectedOrder.status]?.className]}`}>
                                        {statusMap[selectedOrder.status]?.label}
                                    </span>
                                    <div className={style.statusActions}>
                                        {selectedOrder.status === 'pending' && <button className={style.markPaidBtn} disabled={statusLoading} onClick={() => handleStatusChange(selectedOrder._id, 'paid')}>{statusLoading ? 'جاري...' : 'تحديد كمدفوع'}</button>}
                                        {selectedOrder.status === 'paid' && <button className={style.markPendingBtn} disabled={statusLoading} onClick={() => handleStatusChange(selectedOrder._id, 'pending')}>{statusLoading ? 'جاري...' : 'إعادة للانتظار'}</button>}
                                    </div>
                                </div>
                                {statusError && <p className={style.error}>{statusError}</p>}
                            </div>

                            <div className={style.section}>
                                <h3 className={style.sectionTitle}><BsBoxSeam size={15} /> المنتجات</h3>
                                <div className={style.itemsList}>
                                    {selectedOrder.items.map(item => (
                                        <div key={item._id} className={style.itemRow}>
                                            <div className={style.itemInfo}>
                                                <span className={style.itemName}>{item.productName || item.product?.name || 'منتج محذوف'}</span>
                                                <span className={style.itemQty}>× {item.qty}</span>
                                            </div>
                                            <div className={style.itemPrices}>
                                                <span className={style.itemUnitPrice}>{item.price} د.أ / قطعة</span>
                                                <span className={style.itemTotal}>{item.lineTotal} د.أ</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={style.totalRow}>
                                <span>الإجمالي الكلي</span>
                                <span className={style.totalAmount}>{selectedOrder.total.toLocaleString('ar-JO')} د.أ</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;