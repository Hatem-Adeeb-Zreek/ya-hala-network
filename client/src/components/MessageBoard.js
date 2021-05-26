// import modules
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";

// MessageBoard Functional Component
export default function MessageBoard() {
    const boardMessages = useSelector((state) => state && state.boardMessages);

    const [scrolled, setScrolled] = useState(false);
    const [msgEntry, setMsgEntry] = useState(false);

    const elemRef = useRef();

    useEffect(() => {
        setMsgEntry(false);
        boardMessages && !scrolled && (scrollFn(), setScrolled(true));
        msgEntry && scrollFn();
    }, [boardMessages]);

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

    return (
        <>
            <div id="messageBoard">
                <div className="msgboard-innerContainer" ref={elemRef}>
                    {boardMessages && (
                        <div className="msg-items">
                            {boardMessages.map((msg) => (
                                <div className="message" key={msg.id}>
                                    <p className="authorName">
                                        {msg.first} {msg.last}
                                    </p>
                                    <p>{msg.created_at}</p>
                                    <img
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
                                    <p className="message-box">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <textarea
                    autoFocus={true}
                    rows="2"
                    cols="50"
                    onKeyDown={keyCheck}
                />
                <p>
                    hit <strong>Enter</strong> to send
                </p>
            </div>
        </>
    );
}
