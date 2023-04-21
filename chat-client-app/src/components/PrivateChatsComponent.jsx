import ChatIput from "./ChatIput";

function PrivateChatsComponent({
    privateChats,
    setPrivateChats,
    userData,
    setUserData,
    handleMessage,
    stompClient,
    // active user
    tab
}){

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName: tab,
            message: userData.message,
            status:"MESSAGE"
          };
          // the message sent to a user is not sent back
          // so we have to add it to the private chat of the user
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData, "message": ""});
        }
    }


    return(
        <div>
            <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
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
                    handlSendValue={sendPrivateValue}
               />
        </div>
    )

}

export default PrivateChatsComponent;
