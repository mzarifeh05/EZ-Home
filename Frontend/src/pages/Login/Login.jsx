import style from './Login.module.css'
import React, { useState } from 'react'
import lockIcon from '../../assets/lock-icon.svg'
import phoneIcon from '../../assets/phone-icon.svg'
import { Link } from 'react-router-dom';
import WarningPopup from '../../components/Warning-Popup/WarningPopup';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
    const [user, setUser] = useState({ phone: "", pass: "" });
    const [warning, setWarning] = useState(false);

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val))
            if (val.length <= 9) 
                setUser(u => ({ ...u, phone: val }));
    };

    const handlePassChange = (e) => {
        setUser(u => ({ ...u, pass: e.target.value }));
    };

    function inputValidation() {
        if (!user.phone.trim() || !user.pass.trim())
            return false;
        if (user.phone.length !== 9)
            return false;
        return true;
    }

    const handleSubmitClick = () => {
        if (!inputValidation()) {
            setWarning(true);
            return;
        }
    };

    return (
        <>
        <Navbar removed={false}/>
        <div className={style.container}>
            <div className={style.box}>
                <h1>تسجيل الدخول</h1>

                <div className={style.field}>
                    <label htmlFor="phone-input">رقم الهاتف</label>
                    <div className={style.inputBox}>
                        <div className={style.prefix}>
                            <img src={phoneIcon} alt="phone" />
                            <span>+962</span>
                        </div>
                        <input
                            dir="ltr"
                            id='phone-input'
                            value={user.phone}
                            onChange={handlePhoneChange}
                            type="text"
                            inputMode="numeric"
                            placeholder='7XXXXXXXX'
                        />
                    </div>
                </div>

                <div className={style.field}>
                    <label htmlFor="input-password">كلمة المرور</label>
                    <div className={style.inputBox}>
                        <img src={lockIcon} alt="lock" className={style.iconOnly} />
                        <input
                            dir="ltr"
                            id='input-password'
                            value={user.pass}
                            onChange={handlePassChange}
                            type="password"
                            placeholder='password'
                        />
                    </div>
                </div>

                <button onClick={handleSubmitClick} className={style.button}>
                    تسجيل الدخول
                </button>

                <p className={style.p}>
                    ليس لديك حساب؟
                    <Link className={style.link} to="/">
                        <span> إنشاء حساب</span>
                    </Link>
                </p>
            </div>

            {warning && <WarningPopup close={() => setWarning(false)} />}
        </div>
        </>
    )
}

export default Login
