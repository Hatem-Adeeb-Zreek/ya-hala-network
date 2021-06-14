// import modules
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";

// import components
import Online from "./Onlineusers";

// MessageBoard function component
export default function MessageBoard() {
    // Redux setup
    const boardMessages = useSelector((state) => state && state.boardMessages);

    // MessageBoard hooks
    const [scrolled, setScrolled] = useState(false);
    const [msgEntry, setMsgEntry] = useState(false);
    const elemRef = useRef();

    useEffect(() => {
        setMsgEntry(false);
        boardMessages && !scrolled && (scrollFn(), setScrolled(true));
        msgEntry && scrollFn();
    }, [boardMessages]);

    // MessageBoard methods
    function scrollFn() {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newMsgFromClient", e.target.value);
            e.target.value = "";
            setMsgEntry(true);
        }
    };

    // MessageBoard render
    return (
        <>
            <div className="profile-wrapper">
                <Online />
                <h1>Chat Room</h1>
                <div ref={elemRef}>
                    {boardMessages && (
                        <div>
                            {boardMessages.map((msg) => (
                                <div className="message" key={msg.id}>
                                    <img
                                        className="avatar2"
                                        src={
                                            msg.avatar ||
                                            "/profile-fallback.e7a6f788830c.jpg"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/profile-fallback.e7a6f788830c.jpg";
                                        }}
                                        alt={`${msg.first} ${msg.last}`}
                                    />
                                    <div className="msg-info">
                                        <p id="name">
                                            <strong>
                                                {msg.first} {msg.last}:
                                            </strong>
                                        </p>
                                        <p id="message-box">{msg.message}</p>
                                        <p id="date">{msg.created_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div id="area">
                    <textarea
                        id="textarea"
                        autoFocus={true}
                        rows="4"
                        cols="50"
                        onKeyDown={keyCheck}
                    />

                    <p>
                        hit <strong>Enter</strong> to send
                    </p>
                </div>
            </div>
        </>
    );
}
