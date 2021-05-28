// import modules
import io from "socket.io-client";

// import actions
import { mbdbHistory, mbdbNewEntry, onlineUsers, userLeft } from "./actions";

// socket setup
export let socket;
export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("mbdbHistory", (msgs) => {
            store.dispatch(mbdbHistory(msgs));
        });

        socket.on("mbdbNewEntry", (msg) => {
            store.dispatch(mbdbNewEntry(msg));
        });

        socket.on("onlineusers", (usersOnline) =>
            store.dispatch(onlineUsers(usersOnline))
        );
        socket.on("userleft", (usersOnline) =>
            store.dispatch(userLeft(usersOnline))
        );
    }
};
