import React, { useState } from 'react'
import style from './Card.module.css'
import filledHeart from '../../assets/filled-favorite-icon.svg'
import unfilledHeart from '../../assets/unfilled-heart-icon.svg'
import testPhoto from '../../assets/test-photos/coffee-machine.png'
import { Link } from 'react-router-dom'

const Card = () => {
    const [favorite, setFavorite] = useState(false);
    return (
        <div className={style.container}>
            <div className={style.upper}>
                <p>
                    {
                        favorite ?
                            <img onClick={() => setFavorite(!favorite)} src={filledHeart} alt="favorite-icon" />
                            :
                            <img onClick={() => setFavorite(!favorite)} src={unfilledHeart} alt="favorite-icon" />
                    }
                </p>
                <img src={testPhoto} alt="" />
            </div>
            <div className={style.lower}>
                <h2>ماكينة قهوة</h2>
                <h3>30 دينار</h3>
                <p>ماكينة قهوة عملية بتصميم أنيق، تمنحك قهوة غنية بالنكهة خلال ثوانٍ مع سهولة في الاستخدام والتنظيف.</p>
                <div>
                    <Link className={style.a} to=''>المزيد</Link>
                    <button>أضف إلى السلة</button>
                </div>
            </div>
        </div>
    )
}

export default Card
