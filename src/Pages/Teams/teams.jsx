import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Teams.css'


function generateUniqSerial() {  
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {  
        const r = Math.floor(Math.random() * 16);  
        return r.toString(16);  
  });  
}

export default function Teams ({setPlay, getTeamList, socket}) {
    var navigate = useNavigate()
    var [t,st] = useState(null)
    var al = () => alert("room full") 
    useEffect(()=> {
        socket.emit("getteamslist")
    } , [])
    useEffect(()=> {
        socket.on("joined", (msg)=>{
            if( msg === "failed" ) {
               al()
            }else {
                setPlay(t)
                navigate("/play")  
            }
        })
        
    })


    var joinAteam = (i) => {
        return function(){
            st(i)
            socket.emit("jointeam", i)
        };
    }

    var createATeam = ()=>{
        var newname = generateUniqSerial()
        socket.emit("setteamslist",newname )
        // joinAteam(newname)();
    }

    return <div className='startmain'
    >
        <div className='teamBody'>
            <div className='teamCreate' onClick={createATeam}>
                Create New Team
            </div>
            {getTeamList.length > 0 ? <div className='teamJoin'>
                join Team
            </div> : <></>}
            
            <div className='teamList'>
                {getTeamList.map((list, index) => <div key={`teamslist-${index}`} className='teamDiv'
                onClick={joinAteam(list)}
                >{list}</div>)}
            </div>
        </div>
    </div>
}