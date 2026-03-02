import style from './DetailsCard.module.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useParams } from "react-router-dom";

const DetailsCard = () => {
    const { id } = useParams();


    return (
        <>
            <Navbar />
            <h1>Details Card</h1>
            <Footer />
        </>
    )
}

export default DetailsCard