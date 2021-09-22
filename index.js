const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const cors=require('cors');
const app=express();

const server=http.createServer(app);
const io=socketio(server);

app.use(cors());
app.use('/',(req,res)=>{
        res.send({message:"SOCKET SERVER"});
})   






let users=[];
   

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

server.listen(process.env.PORT || 5000,()=>console.log("server started"));
