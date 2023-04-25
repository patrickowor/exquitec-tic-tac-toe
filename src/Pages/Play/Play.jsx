import "./Play.css"
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useReducer } from "react"
var StatelessState = {}


export default function Play({play, socket}){
    const [message , setMessage] = useState({})
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    var [winner, setWinner] = useState(null);
    var [canPlay, setCanPlay] = useState(true);
    var navigate = useNavigate()
    var [getP1, setP1] = useState(null)
    var [getP2, setP2] = useState(null)
    var [getP3, setP3] = useState(null)
    var [getP4, setP4] = useState(null)
    var [getP5, setP5] = useState(null)
    var [getP6, setP6] = useState(null)
    var [getP7, setP7] = useState(null)
    var [getP8, setP8] = useState(null)
    var [getP9, setP9] = useState(null)
    var confirmWin= ()=>{
        forceUpdate();
        console.log("confirm win");
        var ar = [
            [StatelessState["p1"], StatelessState["p2"], StatelessState["p3"]],
            [StatelessState["p4"], StatelessState["p5"], StatelessState["p6"]],
            [StatelessState["p7"], StatelessState["p8"], StatelessState["p9"]],
            [StatelessState["p1"], StatelessState["p4"], StatelessState["p7"]],
            [StatelessState["p2"], StatelessState["p5"], StatelessState["p8"]],
            [StatelessState["p3"], StatelessState["p6"], StatelessState["p9"]],
            [StatelessState["p1"], StatelessState["p5"], StatelessState["p9"]],
            [StatelessState["p3"], StatelessState["p5"], StatelessState["p7"]],
        ]
        for (var i = 0; i < ar.length; i++){
            var [g,h,f] = ar[i]
            if(g === h && g === f && g !== null && g !== undefined){
                setCanPlay(false)
                if (g === "X") {
                    setWinner("youWin")
                } else {
                    setWinner("you Lose")
                }
                socket.emit("win", {"room" : play})
                break
            } else if (
                StatelessState["p1"] !== undefined &&
                StatelessState["p2"] !== undefined &&
                StatelessState["p3"] !== undefined &&
                StatelessState["p4"] !== undefined &&
                StatelessState["p5"] !== undefined &&
                StatelessState["p6"] !== undefined &&
                StatelessState["p7"] !== undefined &&
                StatelessState["p8"] !== undefined &&
                StatelessState["p9"] !== undefined 
            ){
                setWinner("A DRAW")
                socket.emit("win", {"room" : play})
                break
            }
        }

    }
    socket.on("recieveMessage", (msg)=> {
        setMessage({"sender": "opponent" , "val" : msg  });
    })
    socket.on("restart", (msg)=>{
        var restartfunc=() => {
                    [[getP1, setP1], [getP2, setP2] , [getP3, setP3],[getP4, setP4], [getP5, setP5],[getP6, setP6],[getP7, setP7], [getP8, setP8], [getP9, setP9]].forEach((val)=> {
            val[1](null)
        })
        setWinner(null)
        StatelessState = {}
        }
        setTimeout(restartfunc, 5000)
        setCanPlay(true)
    })
    socket.on("opponentplayed", (msg)=> {
        switch (msg) {
            case "p1":
                StatelessState["p1"] = "O"
              setP1("O")
              break
            case "p2":
                StatelessState["p2"] = "O"
                setP2("O")
              break
            case "p3":
                StatelessState["p3"] = "O"
                setP3("O")
                break
            case "p4":
                StatelessState["p4"] = "O"
                setP4("O")
                break
            case "p5":
                StatelessState["p5"] = "O"
                setP5("O")
                break
            case "p6":
                StatelessState["p6"] = "O"
                setP6("O")
                break
            case "p7":
                StatelessState["p7"] = "O"
                setP7("O")
                break
            case "p8":
                StatelessState["p8"] = "O"
                setP8("O")
                break
            case "p9":
                StatelessState["p9"] = "O"
                setP9("O")
                break
            default:
              console.log(msg)
          }
        setCanPlay(true)
        confirmWin()
    })
    
    var onclick =(func, name, val)=>{
        return () => {
            if (canPlay && val === null ){
                StatelessState[name] = "X"
                 func("X")
                 setCanPlay(false)
                 socket.emit("iplayed", {"room" : play, "game" : name})
                 confirmWin()
            }
        }
    }

    useEffect(()=>{
        if (play === null) navigate("/teams")
    }, [])

    return <>{play}
    <div className="info">
        you are x
    </div>
    
    <div className='startmain'
    >
        <div>{winner !== null ? "" :  (canPlay ? "your turn" : "opponent turn")}</div>
        <div>{winner}</div>
        <div className='playBody'>
            {winner === null ? <div class="grid3">
                {  [[getP1, setP1], [getP2, setP2] , [getP3, setP3],[getP4, setP4], [getP5, setP5],[getP6, setP6],[getP7, setP7], [getP8, setP8], [getP9, setP9]].map((list,idx)=> <div className={`div p${idx+ 1}`}  onClick={onclick(list[1], `p${idx+ 1}`, list[0])}>{list[0]}</div>)}
            </div> : <></>}
        </div>
        <div className="messageBox">
            <div>{ Object.keys(message).length === 0 ? <></> : (  message["sender"] === "you" ?  `you: ${message["val"]}` : `opponent : ${message["val"]}`) }</div>
            <input type="text" id="textmessage"  />
            <button onClick={() => {
                try {
                    if (document.getElementById("textmessage").value.trim() !== ""){
                          setMessage({"sender": "you" , "val" : document.getElementById("textmessage").value  })
                    socket.emit("sendMessage",[play,document.getElementById("textmessage").value] );
                    document.getElementById("textmessage").value  = ""; 
                    }
                 
                } catch (error) {
                    //
                }
            }}> send </button>
        </div>
    </div>


    </>
}