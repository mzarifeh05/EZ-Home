import React, { useState } from 'react'
import style from './Register.module.css'
import lockIcon from '../../assets/lock-icon.svg'
import phoneIcon from '../../assets/phone-icon.svg'
import personIcon from '../../assets/person-icon.svg'
import { Link, useNavigate } from 'react-router-dom';
import WarningPopup from '../../components/Warning-Popup/WarningPopup';
import logo from '../../assets/logo.jpg'
import api from "../../api/axios";

const Register = () => {
    const [user, setUser] = useState({ fullName: "", phone: "", password: "" });
    const [conPass, setConPass] = useState("");
    const [warning, setWarning] = useState(false);
    const navigate = useNavigate()
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

    const handleNameChange = (e) => {
        setUser(u => ({ ...u, fullName: e.target.value }));
    };

    const handleConPassChange = (e) => {
        setConPass(e.target.value);
    };

    function inputValidation() {
        if (!user.phone.trim() || !user.password.trim() || !user.fullName.trim() || !conPass.trim())
            return false;
        if (user.phone.length !== 9)
            return false;
        if (user.password !== conPass)
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
            const res = await api.post("/auth/register", { ...user, phone: `00962${user.phone}` }
            );

            localStorage.setItem("token", res.data.data.token);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data || err.message);
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
                    <h1>إنشاء حساب</h1>

                    <div className={style.field}>
                        <label>اسم المستخدم</label>

                        <div className={style.inputBox}>
                            <img src={personIcon} alt="person" className={style.iconOnly} />
                            <input
                                value={user.fullName}
                                onChange={handleNameChange}
                                type="text"
                                placeholder='full name'
                            />
                        </div>
                    </div>

                    <div className={style.field}>
                        <label>رقم الهاتف</label>

                        <div className={style.inputBox}>
                            <div className={style.prefix}>
                                <img src={phoneIcon} alt="phone" />
                                <span>+962</span>
                            </div>

                            <input
                                dir="ltr"
                                value={user.phone}
                                onChange={handlePhoneChange}
                                type="text"
                                inputMode="numeric"
                                placeholder='7XXXXXXXX'
                            />
                        </div>
                    </div>

                    <div className={style.field}>
                        <label>كلمة المرور</label>

                        <div className={style.inputBox}>
                            <img src={lockIcon} alt="lock" className={style.iconOnly} />
                            <input
                                dir="ltr"
                                value={user.password}
                                onChange={handlePassChange}
                                type="password"
                                placeholder='password'
                            />
                        </div>
                    </div>

                    <div className={style.field}>
                        <label>تأكيد كلمة المرور</label>

                        <div className={style.inputBox}>
                            <img src={lockIcon} alt="lock" className={style.iconOnly} />
                            <input
                                dir="ltr"
                                value={conPass}
                                onChange={handleConPassChange}
                                type="password"
                                placeholder='confirm password'
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmitClick} className={style.button}>
                        إنشاء حساب
                    </button>

                    <p className={style.p}>
                        لديك حساب بالفعل؟
                        <Link className={style.link} to="/Login">
                            <span> تسجيل الدخول</span>
                        </Link>
                    </p>
                </div>

                {warning && <WarningPopup close={() => setWarning(false)} />}
            </div>
        </>
    )
}

export default Register
