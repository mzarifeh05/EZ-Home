import React, { useState } from 'react'
import style from './Register.module.css'
import logoImg from '../../assets/logo.jpg';
import lockIcon from '../../assets/lock-icon.svg'
import phoneIcon from '../../assets/phone-icon.svg'
import personIcon from '../../assets/person-icon.svg'
import { Link } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ name: "", phone: "", pass: "" });
    const [conPass, setConPass] = useState("")

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val))
            if (val.length <= 10)
                setUser(u => ({ ...u, phone: val }));
    };

    const handlePassChange = (e) => {
        setUser(u => ({ ...u, pass: e.target.value }));
        console.log(e.target.value)
    };

    const handleNamechange = (e) => {
        setUser(u => ({ ...u, name: e.target.value }));
        console.log(e.target.value)
    };

    const handleConPassChange = (e) => {
        setConPass(e.target.value);
        console.log(e.target.value)
    };

    function inputValidation() {
        if (!user.phone.trim() || !user.pass.trim() || !user.name.trim() || !conPass.trim())
            return false;
        if (user.phone.length !== 10)
            return false;
        if (user.pass !== conPass)
            return false;
        return true;
    }

    return (
        <div className={style.container}>
            <div className={style.box}>
                <img className={style.image} src={logoImg} alt="" />
                <h1>إنشاء حساب</h1>
                <div className={style.inputBox}>
                    <img src={personIcon} />
                    <input
                        value={user.name}
                        onChange={(e) => handleNamechange(e)}
                        type="text"
                        placeholder='اسم المستخدم' />
                </div>
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
                <div className={style.inputBox}>
                    <img src={lockIcon} />
                    <input
                        value={conPass}
                        onChange={(e) => handleConPassChange(e)}
                        type="password"
                        placeholder='تأكيد كلمة المرور' />
                </div>
                <button className={style.button}>إنشاء حساب</button>
                <p className={style.p}>لديك حساب بالفعل؟
                    <Link className={style.link} to="/Login">
                        <span> تسجيل الدخول</span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
