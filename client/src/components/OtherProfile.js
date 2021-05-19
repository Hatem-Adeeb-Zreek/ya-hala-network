// import modules
import React from "react";
import axios from "../axios";
import FriendButton from "./FriendButton";

// OtherProfile Class Component
export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        (async () => {
            try {
                let response = await axios.post(
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
                console.log("error in post /user/id: ", err);
            }
        })();
    }

    render() {
        return (
            <div className="profile">
                <div className="bio-wrapper">
                    <h2 id="memberName">{`${this.state.first} ${this.state.last}`}</h2>
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
