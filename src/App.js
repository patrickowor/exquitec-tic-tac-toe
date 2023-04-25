import Start from "./Pages/Start/Start.jsx"
import {Route, Routes} from "react-router-dom"
import Teams from "./Pages/Teams/teams.jsx";
import { useEffect, useState } from "react";
import Play from "./Pages/Play/Play.jsx";
import {io} from "socket.io-client"


var socket = io();
function App() {
  
  let [play, setPlay] = useState(null)
  var [getTeamList,setTeamList] = useState([])

  useEffect(()=> {
    socket.on("teamlist", (msg)=>{
      console.log(msg);
      setTeamList(msg)
    })
    socket.on("connect", (msg)=>{
      console.log("connected");
    })
  })
  return (
    <>
      <Routes>
        <Route path='/' element={<Start  />} />
        <Route path='/teams' element={<Teams setPlay={setPlay} getTeamList={getTeamList} socket={socket} />} />
        <Route path='/play' element={<Play play={play} socket={socket} />} />
      </Routes>
    </>

  );
}
export default App;
