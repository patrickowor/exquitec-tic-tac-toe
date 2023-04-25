import './Start.css'
import { useNavigate } from 'react-router-dom'

export default function Start () {
    var navigate = useNavigate()
    var gotoTeams = ()=>{
        navigate("/teams")
    }

    return <main className='startmain'>
        <div className='starttitle'>TIC TAC TOE</div>
        <div className='startbutton '
            onClick={gotoTeams}
        >
            <div className ="startimgdiv starttext">Start</div>

             <div className='startimgdiv'>
                <div className='startimg'></div>
            </div>
        </div>
    </main>
}