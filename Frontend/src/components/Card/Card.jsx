import React from 'react'
import style from './Card.module.css'
import filledHeart from '../../assets/filled-favorite-icon.svg'
import testPhoto from '../../assets/test-photos/coffee-machine.png'
import infoIcon from '../../assets/info-icon.svg'
import { Link } from 'react-router-dom'

const Card = () => {
    return (
        <div className={style.container}>
            <div className={style.upper}>
                <p><img src={filledHeart} alt="favorite-icon" /></p>
                <img src={testPhoto} alt="" />
            </div>
            <div className={style.lower}>
                <h2>ماكينة قهوة</h2>
                <h3>30 دينار</h3>
                <p>ماكينة قهوة عملية بتصميم أنيق، تمنحك قهوة غنية بالنكهة خلال ثوانٍ مع سهولة في الاستخدام والتنظيف.</p>
                <div>
                    {/* <img src={infoIcon} alt="" /> */}
                    <Link className={style.a} to=''>المزيد</Link>
                    <button>أضف إلى السلة</button>
                </div>
            </div>
        </div>
    )
}

export default Card
