import io from "socket.io-client";
import { mbdbHistory, mbdbNewEntry } from "./actions";

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
    } //end of IF block
};
