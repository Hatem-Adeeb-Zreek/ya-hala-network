// import modules
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getList, unfriend, accept, reject, cancel } from "../actions";
import { Link } from "react-router-dom";

// Friends function component
export default function Friends() {
    // Redux setup and Friends hooks
    const dispatch = useDispatch();
    let friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted)
    );
    let wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((each) => each.accepted == false)
    );
    let pendings = useSelector((state) => state.myRequests && state.myRequests);
    useEffect(() => {
        dispatch(getList());
    }, []);

    friends && friends.length == 0 && (friends = null);
    wannabes && wannabes.length == 0 && (wannabes = null);
    pendings && pendings.length == 0 && (pendings = null);

    // Friends render
    return (
        <>
            <div className="profile-wrapper">
                {!friends && !wannabes && !pendings && (
                    <h2>No Friendships to Show</h2>
                )}
                {friends && (
                    <div>
                        <h2>My Friends</h2>
                        <div>
                            {friends.map((friend) => (
                                <div className="friends" key={friend.id}>
                                    <Link to={`/user/${friend.id}`}>
                                        <img
                                            className="avatar1"
                                            src={
                                                friend.avatar ||
                                                "/profile-fallback.e7a6f788830c.jpg"
                                            }
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/profile-fallback.e7a6f788830c.jpg";
                                            }}
                                            alt={`${friend.first} ${friend.last}`}
                                        />
                                    </Link>
                                    <div className="friends-info">
                                        <p>
                                            {friend.first} {friend.last}
                                        </p>

                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(friend.id))
                                            }
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {wannabes && (
                    <div>
                        <h2>People want to be Your Friends</h2>
                        <div>
                            {wannabes.map((wannabe) => (
                                <div className="friends" key={wannabe.id}>
                                    <Link to={`/user/${wannabe.id}`}>
                                        <img
                                            className="avatar1"
                                            src={
                                                wannabe.avatar ||
                                                "/profile-fallback.e7a6f788830c.jpg"
                                            }
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/profile-fallback.e7a6f788830c.jpg";
                                            }}
                                            alt={`${wannabe.first} ${wannabe.last}`}
                                        />
                                    </Link>
                                    <div className="friends-info">
                                        <p>
                                            {wannabe.first} {wannabe.last}
                                        </p>
                                        <div>
                                            <button
                                                onClick={() =>
                                                    dispatch(accept(wannabe.id))
                                                }
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    dispatch(reject(wannabe.id))
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pendings && (
                    <div>
                        <h2>My pending Requests</h2>
                        <div>
                            {pendings.map((pending) => (
                                <div className="friends" key={pending.id}>
                                    <Link to={`/user/${pending.id}`}>
                                        <img
                                            className="avatar1"
                                            src={
                                                pending.avatar ||
                                                "/profile-fallback.e7a6f788830c.jpg"
                                            }
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/profile-fallback.e7a6f788830c.jpg";
                                            }}
                                            alt={`${pending.first} ${pending.last}`}
                                        />
                                    </Link>
                                    <div className="friends-info">
                                        <p>
                                            {pending.first} {pending.last}
                                        </p>

                                        <button
                                            onClick={() =>
                                                dispatch(cancel(pending.id))
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
