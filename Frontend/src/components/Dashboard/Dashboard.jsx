import style from './Dashboard.module.css'

const Dashboard = () => {
    return (
        <div>
            <iframe className={style.dashboard} title="Dashboard" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=bb920b7a-9582-4202-a447-bcd65c3d5c54&autoAuth=true&ctid=8f37fac6-3111-4f3d-ae72-d46205992edc" frameborder="0" allowFullScreen="true"></iframe>
        </div>
    )
}

export default Dashboard
