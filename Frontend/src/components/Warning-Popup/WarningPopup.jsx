import React from 'react'
import style from './WarningPopup.module.css'
import warningIcon from '../../assets/warning-icon.svg';

const WarningPopup = ({ message = "الرجاء التأكد من صحة البيانات المدخلة", close }) => {
    return (
        <div className={style.overlay}>
            <div className={style.container}>
                <img src={warningIcon} alt="warning-icon" />
                <h1>تنبيه</h1>
                <p>{message}</p>
                <button onClick={close}>حسنا</button>
            </div>
        </div>
    )
}

export default WarningPopup
