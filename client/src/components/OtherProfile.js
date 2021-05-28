// import modules
import React from "react";
import axios from "../axios";

// import components
import FriendButton from "./FriendButton";

// OtherProfile class component
export default class OtherProfile extends React.Component {
    // OtherProfile constructor
    constructor() {
        super();
        this.state = {};
    }

    // OtherProfile methods
    componentDidMount() {
        (async () => {
            try {
                let response = await axios.get(
                    `/user/${this.props.match.params.id}`
                );
                if (response.data.rows && !response.data.match) {
                    const { first, last, avatar, bio } = response.data.rows;
                    this.setState({
                        first: first,
                        last: last,
                        profilePicUrl: avatar,
                        bio: bio,
                    });
                } else {
                    this.props.history.push("/");
                }
            } catch (err) {
                console.log("error in get /user/id: ", err);
            }
        })();
    }

    // OtherProfile render
    render() {
        return (
            <div className="profile">
                <div>
                    <h2>{`${this.state.first} ${this.state.last}`}</h2>
                    <p className="bio-text1">
                        {this.state.bio || "No Bio yet"}
                    </p>
                    <FriendButton otherId={this.props.match.params.id} />
                </div>

                <img
                    className="avatar1"
                    key={this.state.profilePicUrl}
                    src={
                        this.state.profilePicUrl ||
                        "/profile-fallback.e7a6f788830c.jpg"
                    }
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/profile-fallback.e7a6f788830c.jpg";
                    }}
                    alt={`${this.state.first} ${this.state.last}`}
                />
            </div>
        );
    }
}
