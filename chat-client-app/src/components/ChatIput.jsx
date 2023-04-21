
function ChatIput({
    message,
    userData,
    handleMessage,
    handlSendValue,
}){

    return (
        <div>
            <div className="send-message">
                <input type="text" className="input-message" placeholder={message} value={userData.message} onChange={handleMessage} /> 
                <button type="button" className="send-button" onClick={handlSendValue}>send</button>
            </div>
        </div>
    )
    
}

export default ChatIput;
