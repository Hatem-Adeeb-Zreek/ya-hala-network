import io from "socket.io-client";
// online users feature
import { mbdbHistory, mbdbNewEntry, onlineUsers, userLeft } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("mbdbHistory", (msgs) => {
            store.dispatch(mbdbHistory(msgs));
            // console.log("array to be dispatched: ", msgs);
        });

        socket.on("mbdbNewEntry", (msg) => {
            store.dispatch(mbdbNewEntry(msg));
            // console.log("array with new msg:", msg);
        });
        // online users feature
        socket.on("onlineusers", (usersOnline) =>
            store.dispatch(onlineUsers(usersOnline))
        );
        socket.on("userleft", (usersOnline) =>
            store.dispatch(userLeft(usersOnline))
        );
        // end
    } //end of IF block
};
