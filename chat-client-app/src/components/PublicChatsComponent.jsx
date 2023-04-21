import ChatIput from "./ChatIput";

function PublicChatsComponent({
    publicChats,
    userData,
    setUserData,
    handleMessage,
    stompClient,
}){

    const sendValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            message: userData.message,
            status: "MESSAGE"
          };
          console.log(chatMessage);
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
          setUserData({...userData, "message": ""});
        }
    }

    return(
        <div>
            <ul className="chat-messages">
                    {publicChats.map((chat, index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

               <ChatIput
                    message={"Enter the message ..."}
                    userData={userData}
                    handleMessage={handleMessage}
                    handlSendValue={sendValue}
               />
        </div>
    )

}

export default PublicChatsComponent;
