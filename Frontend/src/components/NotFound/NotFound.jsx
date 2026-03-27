import style from './NotFound.module.css'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className={style.container}>
            <h1 style={{color: 'white'}}>حدث خطأ!</h1>
            <h2 style={{color: 'white'}}>الصفحة غير موجودة</h2>
            <p style={{color: 'white'}}>
                العودة الى
                <span> </span>
                <Link to="/">الصفحة الرئيسية</Link>
            </p>
        </div>
    )
}

export default NotFound
