// import modules
import React from "react";
import axios from "../axios";

// OtherProfile Class Component
export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        let otherProfileId = this.props.match.params.id;
        (async () => {
            try {
                let response = await axios.post(`/user/${otherProfileId}`);
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
                console.log("error in POST /user/id: ", err);
            }
        })();
    }

    render() {
        return (
            <div className="profile">
                <div className="bio-wrapper">
                    <h1>{`${this.state.first} ${this.state.last}`}</h1>
                    <p className="bio-text1">
                        {this.state.bio || "No Bio yet"}
                    </p>
                </div>

                <img
                    className="avatar1"
                    key={this.state.profilePicUrl}
                    src={this.state.profilePicUrl}
                    alt={`${this.state.first} ${this.state.last}`}
                />
            </div>
        );
    }
}
