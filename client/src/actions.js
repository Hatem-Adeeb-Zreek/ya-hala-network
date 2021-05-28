// import modules
import axios from "./axios";

// getList action
export async function getList() {
    try {
        const { data } = await axios.get("/getFriends");
        return {
            type: "GET_LIST",
            myRequests: data.myRequests,
            friendsWannabes: data.friendsWannabes,
        };
    } catch (err) {
        console.log("error in axios GET /getFriends ", err);
    }
}

// unfriend Action
export async function unfriend(id) {
    try {
        let { data } = await axios.post(`/setFriendship/${id}`);

        if (data.success) {
            return {
                type: "UNFRIENDED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /setFriendship ", err);
    }
}

// accept Action
export async function accept(id) {
    try {
        //
        let { data } = await axios.post(`/setFriendship/${id}`);
        if (data.success) {
            return {
                type: "ACCEPTED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /setFriendship ", err);
    }
}

// reject Action
export async function reject(id) {
    let body = { action: "reject" };
    try {
        let { data } = await axios.post(`/setFriendship/${id}`, body);
        if (data.success) {
            return {
                type: "REJECTED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /setFriendship ", err);
    }
}

// cancel Action
export async function cancel(id) {
    try {
        let { data } = await axios.post(`/setFriendship/${id}`);
        if (data.success) {
            return {
                type: "CANCELLED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /setFriendship ", err);
    }
}

//MessageBoard Actions
export function mbdbHistory(msgs) {
    return {
        type: "RETRIEVED_MSGS",
        msgsHistory: msgs,
    };
}

export function mbdbNewEntry(msg) {
    return {
        type: "NEW_MSG",
        newestMessage: msg,
    };
}

export function onlineUsers(onlineUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers,
    };
}
export function userLeft(onlineUsers) {
    return {
        type: "USER_LEFT",
        onlineUsers,
    };
}
