require("dotenv").config()
const express=require("express");
const app = express();
const cors=require('cors');
const server = require("http").createServer(app);
app.use(cors());
const options={
  cors:true,
  origins:["ws://eimentum.vercel.app/"]
 }
//  const options={
//         cors:true,
//         origins:["ws://localhost:3000/"]
//        }
 
const io = require("socket.io")(server,options);

const PORT = process.env.PORT ||8000;
app.use(express.json())

app.use(cors());

server.listen(PORT, () => console.log(`runnig on port ${PORT}`));
app.get('/',(req,res)=>{
        res.send({message:"SOCKET SERVER"});
})
let users=[];
// const io=require("socket.io")(8900,{
//    cors:{
//            origin:process.env.SOCKETURL
//    }
// });     

const addUserHandler=(username,socket_id)=>{
   
 users.forEach(user=>{
         if(user.username===username){
                 return;
         }
 })

 users.push({username,socket_id});
  
}
const removeUserHandler=(socket_id)=>{
        return users.filter(user=>user.socket_id!==socket_id);
}
const getuser=(receiver)=>{
        return users.find(user=>user.username===receiver);
}
io.on("connect",(socket)=>{
    

        console.log("connected")

    socket.emit("Welcome",{message:"Welcome Buddy !"});
    socket.on("adduser",(username)=>{

                const socket_id=socket.id;
                addUserHandler(username,socket_id);
        
                socket.emit("getuser",users);
                
     
    });
    socket.on("sendmessage",({receiver,sender,text})=>{
        let rec=getuser(receiver);
     
        io.to(rec.socket_id).emit("getmessage",{
                sender,
                text 
        });
    })
    socket.on("disconnect",()=>{
        let socket_id=socket.id;
        users=removeUserHandler(socket_id);
    
        socket.emit("getuser",users);
     
        
     
    });


})
