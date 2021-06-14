// import modules
import React from "react";
import axios from "../axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

// import components
import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./Logo";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./friends";
import MessageBoard from "./MessageBoard";

// App class component
export default class App extends React.Component {
    // App constructor
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
        this.methodInAppBio = this.methodInAppBio.bind(this);
    }

    // App Methods
    componentDidMount() {
        (async () => {
            try {
                let response = await axios.get("/user");
                const { id, first, last, avatar, bio } = response.data.rows;
                this.setState({
                    id: id,
                    first: first,
                    last: last,
                    profilePicUrl: avatar,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios get /user: ", err);
            }
        })();
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInAppBio(arg) {
        this.setState({ bio: arg });
    }

    methodInApp(arg) {
        this.setState({ profilePicUrl: arg });
        this.toggleUploader();
    }

    logOut() {
        (async () => {
            try {
                await axios.get("/logout");
                location.replace("/welcome#/login");
            } catch (err) {
                console.log("error in axios GET /logout ", err);
            }
        })();
    }

    // App render
    render() {
        return (
            <BrowserRouter>
                <header className="app-header">
                    <Logo />
                    <div className="app-right">
                        <Link to={"/users"}>Find People</Link>
                        <Link to={"/friends"}>Friends</Link>
                        <Link to={"/msgboard"}> Chat</Link>
                        <button name="logOut" onClick={() => this.logOut()}>
                            log out
                        </button>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            key={this.state.profilePicUrl}
                            profilePicUrl={this.state.profilePicUrl}
                            toggleUploader={() => this.toggleUploader()}
                        />
                    </div>
                </header>
                <section className="profile-wrapper">
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                profilePicUrl={this.state.profilePicUrl}
                                bio={this.state.bio}
                                methodInAppBio={this.methodInAppBio}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route exact path="/users" render={() => <FindPeople />} />
                </section>
                <Route exact path="/friends" render={() => <Friends />} />
                <Route exact path="/msgboard" render={() => <MessageBoard />} />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        profilePicUrl={this.state.profilePicUrl}
                    />
                )}
            </BrowserRouter>
        );
    }
}
