// import modules
import { useState, useEffect } from "react";
import axios from "../axios";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState("");
    const [btnUpdate, setBtnUpdate] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                // post ---- get
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
