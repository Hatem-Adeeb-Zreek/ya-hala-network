// import modules
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
// online users feature
import Online from "./Onlineusers";

// MessageBoard Functional Component
export default function MessageBoard() {
    const boardMessages = useSelector((state) => state && state.boardMessages);

    const [scrolled, setScrolled] = useState(false);
    const [msgEntry, setMsgEntry] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

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
            <div className="profile-wrapper">
                {/* online users feature */}
                <Online />
                <h1>Chat Room</h1>
                <div className="msgboard-innerContainer" ref={elemRef}>
                    {boardMessages && (
                        <div className="msg-items">
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

                    <div>
                        {chosenEmoji ? (
                            <span>You chose: {chosenEmoji.emoji}</span>
                        ) : (
                            <span>No emoji Chosen</span>
                        )}
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                    <p>
                        hit <strong>Enter</strong> to send
                    </p>
                </div>
            </div>
        </>
    );
}
