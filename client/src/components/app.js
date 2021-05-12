// import modules
import React from "react";
// import ProfileIcon from "./profile-icon";
import axios from "../axios";
import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
// import Profile from "./profile";
import Logo from "./Logo";

// App Class Component
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
    }

    componentDidMount() {
        (async () => {
            try {
                let response = await axios.post("/user");
                const { first, last, p_pic_url } = response.data.rows;
                this.setState({
                    first: first,
                    last: last,
                    profilePicUrl: p_pic_url,
                });
            } catch (err) {
                console.log("error in axios POST /user: ", err);
            }
        })();
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        this.setState({ profilePicUrl: arg });
        this.toggleUploader();
    }

    render() {
        return (
            <>
                <header className="profile-header">
                    <Logo />
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        key={this.state.profilePicUrl}
                        profilePicUrl={this.state.profilePicUrl}
                        toggleUploader={() => this.toggleUploader()}
                    />
                </header>

                {/* <Profile first={this.state.first} /> */}

                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        profilePicUrl={this.state.profilePicUrl}
                    />
                )}
            </>
        );
    }
}
