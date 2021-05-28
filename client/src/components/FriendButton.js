// import modules
import { useState, useEffect } from "react";
import axios from "../axios";

// FriendButton function component
export default function FriendButton({ otherId }) {
    // FriendButton hooks
    const [buttonText, setButtonText] = useState("");
    const [btnUpdate, setBtnUpdate] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.get(`/checkFriendStatus/${otherId}`);
                setButtonText(data.btnText);
            } catch (err) {
                console.log(
                    "error in axios get /checkFriendStatus/otherId:",
                    err
                );
            }
        })();
    }, [btnUpdate]);

    // FriendButton methods
    function handleClick() {
        setBtnUpdate(false);
        (async () => {
            try {
                let { data } = await axios.post(`/setFriendship/${otherId}`);
                data.success && setBtnUpdate(true);
            } catch (err) {
                console.log("error in axios post /setFriendship/otherId:", err);
            }
        })();
    }

    // FriendButton render
    return (
        <button
            id="friend-btn"
            name="friendship"
            onClick={() => {
                handleClick();
            }}
        >
            {buttonText}
        </button>
    );
}
