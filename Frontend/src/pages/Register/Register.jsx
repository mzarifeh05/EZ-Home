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
    const [warningMessage, setWarningMessage] = useState("");
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
            return "الرجاء تعبئة جميع الحقول";
        if (user.phone.length !== 9)
            return "رقم الهاتف يجب أن يتكون من 9 أرقام";
        if (user.password !== conPass)
            return "كلمتا المرور غير متطابقتين";
        return null;
    }

    const handleSubmitClick = async (e) => {
        // Prevent default form submission (page reload)
        if (e) e.preventDefault();

        const validationError = inputValidation();
        if (validationError) {
            setWarningMessage(validationError);
            setWarning(true);
            return;
        }
        try {
            setLoading(true);
            const res = await api.post("/auth/register", { ...user, phone: `00962${user.phone}` });
            localStorage.setItem("token", res.data.data.token);
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.message || "حدث خطأ، يرجى المحاولة مرة أخرى";
            setWarningMessage(msg);
            setWarning(true);
        } finally {
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

                    {/* form tag enables Enter key submission */}
                    <form onSubmit={handleSubmitClick} autoComplete="on">
                        <div className={style.field}>
                            <label>اسم المستخدم</label>
                            <div className={style.inputBox}>
                                <img src={personIcon} alt="person" className={style.iconOnly} />
                                <input
                                    name="name"
                                    autoComplete="name"
                                    value={user.fullName}
                                    onChange={handleNameChange}
                                    type="text"
                                    placeholder='full name'
                                    disabled={loading}
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
                                    name="username"
                                    autoComplete="username"
                                    value={user.phone}
                                    onChange={handlePhoneChange}
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='7XXXXXXXX'
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className={style.field}>
                            <label>كلمة المرور</label>
                            <div className={style.inputBox}>
                                <img src={lockIcon} alt="lock" className={style.iconOnly} />
                                <input
                                    dir="ltr"
                                    name="password"
                                    autoComplete="new-password"
                                    value={user.password}
                                    onChange={handlePassChange}
                                    type="password"
                                    placeholder='password'
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className={style.field}>
                            <label>تأكيد كلمة المرور</label>
                            <div className={style.inputBox}>
                                <img src={lockIcon} alt="lock" className={style.iconOnly} />
                                <input
                                    dir="ltr"
                                    name="confirm-password"
                                    autoComplete="new-password"
                                    value={conPass}
                                    onChange={handleConPassChange}
                                    type="password"
                                    placeholder='confirm password'
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* type="submit" enables Enter key */}
                        <button
                            type="submit"
                            className={`${style.button} ${loading ? style.buttonLoading : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className={style.spinnerWrapper}>
                                    <span className={style.spinner}></span>
                                    <span>جارٍ التحميل...</span>
                                </span>
                            ) : (
                                'إنشاء حساب'
                            )}
                        </button>
                    </form>

                    <p className={style.p}>
                        لديك حساب بالفعل؟
                        <Link className={style.link} to="/Login">
                            <span> تسجيل الدخول</span>
                        </Link>
                    </p>
                </div>

                {loading && (
                    <div className={style.overlay}>
                        <div className={style.overlaySpinner}>
                            <div className={style.ring}></div>
                            <div className={style.ring}></div>
                            <div className={style.ring}></div>
                        </div>
                    </div>
                )}

                {warning && <WarningPopup message={warningMessage} close={() => setWarning(false)} />}
            </div>
        </>
    )
}

export default Register