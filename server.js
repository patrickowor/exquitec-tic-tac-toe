const express = require("express");
const app = express();
const server = require('http').createServer(app);
const Serverio = require('socket.io');
const socketio =  Serverio(server)
  
let host = "0.0.0.0"
const port = process.env.PORT || 3001


var LISTOFTEAMS = []
var TeamsMap = {}

socketio.on('connection', (sock) => {  
    sock.on("sendMessage", (msg)=> {
        sock.broadcast.to(msg[0]).emit('recieveMessage', msg[1]);
    })
    sock.on("win",(msg)=> {
        sock.emit('restart', "")
        sock.broadcast.to(msg["room"]).emit('restart', "");
    })  
    sock.on("iplayed",(msg)=> {
        console.log(msg)
        sock.broadcast.to(msg["room"]).emit('opponentplayed', msg["game"]);
    })
    sock.on("jointeam", (msg)=>{
        if (TeamsMap[msg] === undefined){
            TeamsMap[msg] = []
        } else {
            
            if(TeamsMap[msg].length > 1 ){
                delete TeamsMap[msg]
                LISTOFTEAMS = LISTOFTEAMS.filter(function(item) {
                    return item !== msg
                })
                sock.emit("joined", "failed")
                sock.emit("teamlist", LISTOFTEAMS)
                sock.broadcast.emit("teamlist", LISTOFTEAMS)
            } else {
                TeamsMap[msg].push(sock.id)
                sock.join(msg);
                sock.emit("joined", "success")
            }
        }
    })

    sock.on("setteamslist", (msg)=> {
        LISTOFTEAMS.push(msg)
        sock.emit("teamlist", LISTOFTEAMS)
        sock.broadcast.emit("teamlist", LISTOFTEAMS)
    })

    sock.on("getteamslist", function(){
        sock.emit("teamlist", LISTOFTEAMS)
    })
    sock.on('disconnect', function () {
        
    });
})
 
app.use("/", express.static("build"))
// app.use("/socket/", )
app.use("static/", express.static("build/static"))

server.listen(port, host , ()=> {
    console.log(`app running on port http://${host}:${port}`);
})
module.exports = app;