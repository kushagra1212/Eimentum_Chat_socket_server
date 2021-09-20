require("dotenv").config()
let users=[];
const io=require("socket.io")(8900,{
   cors:{
           origin:process.env.SOCKETURL
   }
});     

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

