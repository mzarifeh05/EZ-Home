import style from './Login.module.css'
import React, { useState } from 'react'
import logoImg from '../../assets/logo.jpg';
import lockIcon from '../../assets/lock-icon.svg'
import phoneIcon from '../../assets/phone-icon.svg'
import { Link } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState({ phone: "", pass: "" });

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val))
            if (val.length <= 10)
                setUser(u => ({ ...u, phone: val }));
    };

    const handlePassChange = (e) => {
        setUser(u => ({ ...u, pass: e.target.value }));
    };

    function inputValidation() {
        if (!user.phone.trim() || !user.pass.trim())
            return false;
        if (user.phone.length !== 10)
            return false;
        return true;
    }

    return (
        <div className={style.container}>
            <div className={style.box}>
                <img className={style.image} src={logoImg} alt="" />
                <h1>تسجيل الدخول</h1>
                <div className={style.inputBox}>
                    <img src={phoneIcon} />
                    <input
                        value={user.phone}
                        onChange={(e) => handlePhoneChange(e)}
                        type="text"
                        inputMode="numeric"
                        placeholder='رقم الهاتف' />
                </div>
                <div className={style.inputBox}>
                    <img src={lockIcon} />
                    <input
                        value={user.pass}
                        onChange={(e) => handlePassChange(e)}
                        type="password"
                        placeholder='كلمة المرور' />
                </div>
                <button className={style.button}>تسجيل الدخول</button>
                <p className={style.p}>ليس لديك حساب؟
                    <Link className={style.link} to="/">
                        <span> إنشاء حساب</span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
