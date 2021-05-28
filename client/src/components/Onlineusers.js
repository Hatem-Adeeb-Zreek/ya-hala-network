// import modules
import { useEffect } from "react";
import { useSelector } from "react-redux";

// Online function component
export default function Online() {
    // Redux setup
    const onlineUsers = useSelector((state) => state && state.onlineUsers);

    // Online hooks
    useEffect(() => {}, [onlineUsers]);

    // Online render
    if (!onlineUsers) {
        return null;
    } else {
        return (
            <div>
                {!onlineUsers.length && <h5>No Users Online!</h5>}
                {!!onlineUsers.length && (
                    <div>
                        <h1>Online Users</h1>
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
