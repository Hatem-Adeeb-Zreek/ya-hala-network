// online users feature
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Online() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    // console.log(" Chat.js - here is a list of my last chatMessages :", chatMessages);

    useEffect(() => {
        // console.log("Onlineusers hooks component mounted");
    }, [onlineUsers]); //array has to have onlineUsers in it
    if (!onlineUsers) {
        return null;
    } else {
        return (
            <div id="online-users">
                {!onlineUsers.length && <h5>No users online!</h5>}
                {!!onlineUsers.length && (
                    <div>
                        <h1 className="online-greet">Online Users</h1>
                        <div id="online-users-container">
                            {onlineUsers.map((onlineUser, i) => (
                                <div className="online-user" key={i}>
                                    <img
                                        className="avatar2"
                                        src={
                                            onlineUser.avatar ||
                                            "profile-fallback.e7a6f788830c.jpg"
                                        }
                                    />
                                    <p>
                                        {onlineUser.first} {onlineUser.last} 🔵
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
// end
