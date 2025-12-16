import { io } from "socket.io-client";
import JoinChatFrom from "./Components/JoinChatFrom/JoinChatFrom";
import { useEffect, useState } from "react";
import ChatWindow from "./Components/ChatWindow/ChatWindow";


// inisilaging connection
const socket = io("http://localhost:3001");

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Client connected:", socket.id);
    });

    return () =>{
      socket.off("connect");
    }
  },[])

  const handleJoinRoom = () => {
    // adding user to the room
    socket.emit("user_join_Room", { username, roomId });
    setIsInRoom(true);
    
  }

  return (
    <>
      {isInRoom ? <ChatWindow username={username} roomId={roomId} socket={socket}/>: <JoinChatFrom onJoin={handleJoinRoom}
       setUsername={setUsername} username={username} setRoomId={setRoomId} roomId={roomId}>

        </JoinChatFrom>}
      
    </>
  )
}

export default App;
