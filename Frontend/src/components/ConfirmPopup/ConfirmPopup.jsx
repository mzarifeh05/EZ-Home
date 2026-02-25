import React from 'react'
import style from './ConfirmPopup.module.css'
import logoutIcon from '../../assets/logout-icon.svg'

const ConfirmPopup = ({ message = "هل أنت متأكد أنك تريد تسجيل الخروج؟", onConfirm, onCancel }) => {
    return (
        <div className={style.overlay}>
            <div className={style.container}>
                <img src={logoutIcon} alt="logout-icon" />
                <h1>تأكيد</h1>
                <p>{message}</p>
                <div className={style.actions}>
                    <button className={style.confirmBtn} onClick={onConfirm}>نعم</button>
                    <button className={style.cancelBtn} onClick={onCancel}>إلغاء</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPopup