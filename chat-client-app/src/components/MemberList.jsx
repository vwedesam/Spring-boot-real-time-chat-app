

function MemberList({
    userData,
    privateChats,
    setTab,
    tab
}){

    return (
        <div className="member-list">
            <ul>
                <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                {[...privateChats.keys()].map((name, index)=>{
                    if(name !== userData.username){
                        return <li onClick={()=>{setTab(name)}} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                    }
                })}
            </ul>
        </div>
    )
}

export default MemberList;
