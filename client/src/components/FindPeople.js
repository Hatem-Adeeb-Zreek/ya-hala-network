// import modules
import { useState, useEffect } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

// FindPeople Function Component
export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.post("/users");
                setUsers(data);
            } catch (err) {
                console.log("error in axios POST /users:", err);
            }
        })();
    }, []);
    useEffect(() => {
        let abort;
        (async () => {
            try {
                let { data } = await axios.post(`/users/${userSearch}`);
                if (data.length == 0) {
                    setUsers(data);
                    setEmpty(true);
                } else {
                    if (!abort) {
                        setUsers(data);
                        setEmpty(false);
                    } else {
                        console.log("aborted!");
                    }
                }
            } catch (err) {
                console.log("error in axios POST /users/search:", err);
            }
        })();
        return () => {
            abort = true;
        };
    }, [userSearch]);

    return (
        <div className="members-wrapper">
            <h1>Recent Members</h1>
            <div>
                {users &&
                    users.map((user) => (
                        <div key={user.id}>
                            <div className="members">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="members-pic"
                                        src={
                                            user.avatar ||
                                            "/profile-fallback.e7a6f788830c.jpg"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/profile-fallback.e7a6f788830c.jpg";
                                        }}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                </Link>
                                <h3>
                                    {user.first} {user.last}
                                </h3>
                            </div>
                        </div>
                    ))}
                {empty && <h2>No Results Found</h2>}
            </div>
            <div className="search-bar">
                <h3>Search for Members</h3>
                <input
                    className="search"
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="type member's name here to search.."
                ></input>
            </div>
        </div>
    );
}
