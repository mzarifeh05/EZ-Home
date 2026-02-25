import style from './Login.module.css'
import React, { useState } from 'react'
import lockIcon from '../../assets/lock-icon.svg'
import phoneIcon from '../../assets/phone-icon.svg'
import { Link, useNavigate } from 'react-router-dom';
import WarningPopup from '../../components/Warning-Popup/WarningPopup';
import logo from '../../assets/logo.jpg'
import api from "../../api/axios";

const Login = () => {
    const [user, setUser] = useState({ phone: "", password: "" });
    const [warning, setWarning] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^\d+$/.test(val))
            if (val.length <= 9)
                setUser(u => ({ ...u, phone: val }));
    };

    const handlePassChange = (e) => {
        setUser(u => ({ ...u, password: e.target.value }));
    };

    function inputValidation() {
        if (!user.phone.trim() || !user.password.trim())
            return false;
        if (user.phone.length !== 9)
            return false;
        return true;
    }

    const handleSubmitClick = async () => {
        if (!inputValidation()) {
            setWarning(true);
            return;
        }
        try {
            setLoading(true);
            const res = await api.post("/auth/login", { ...user, phone: `00962${user.phone}` }
            );

            localStorage.setItem("token", res.data.data.token)
            navigate('/')
        } catch (err) {
            console.error(err.response?.data || err.message);
            setWarning(true)
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={style.container}>
                <div className={style.logo}>
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                </div>
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
                                value={user.password}
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
                        <Link className={style.link} to="/Register">
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
