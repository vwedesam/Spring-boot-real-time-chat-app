import React, { useState } from 'react';
import Register from './Register';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import MemberList from './MemberList';
import PublicChatsComponent from './PublicChatsComponent';
import PrivateChatsComponent from './PrivateChatsComponent';

let stompClient = null;

function ChatDashboard(){

    const [publicChats, setPublicChats] = useState([]);
    // map
    // keys - username
    // values - arrays of messages
    const [privateChats, setPrivateChats] = useState(new Map());
    // active tab -> CHATROOM(public) or active USERNAME(private)
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        connected: false,
        message: ""
    });

    console.log(userData, "userData")

    console.log("tab", tab)

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
          senderName: userData.username,
          status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    // receive message
    // receive join event -> when a new user join the chat
    const onMessageReceived = (payload)=>{
        console.log("message payload ...", payload)
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            let messages = privateChats.get(payloadData.senderName)
            messages.push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let messages =[];
            messages.push(payloadData);
            privateChats.set(payloadData.senderName, messages);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event)=>{
        const {value}=event.target;
        setUserData({...userData, "message": value});
    }

    return (
        <div className="container">
            {userData.connected ?
            (<div className="chat-box"> 
                <MemberList
                    userData={userData}
                    tab={tab}
                    setTab={setTab}
                    privateChats={privateChats}
                />
                <div className="chat-content">
                    {
                        tab === "CHATROOM" ?
                        <PublicChatsComponent
                            stompClient={stompClient}
                            publicChats={publicChats}
                            userData={userData}
                            setUserData={setUserData}
                            handleMessage={handleMessage}
                        />:
                        <PrivateChatsComponent
                            stompClient={stompClient}
                            privateChats={privateChats}
                            setPrivateChats={setPrivateChats}
                            userData={userData}
                            setUserData={setUserData}
                            handleMessage={handleMessage}
                            tab={tab}
                        />
                    }
                </div>
            </div>):
            <Register
                userData={userData}
                setUserData={setUserData}
                onConnect={connect}
            />}
        </div>
    )
}

export default ChatDashboard;
