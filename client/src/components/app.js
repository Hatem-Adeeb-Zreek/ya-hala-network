// import modules
import React from "react";
import axios from "../axios";
import ProfilePic from "./ProfilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import Logo from "./Logo";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import { Link } from "react-router-dom";

// App Class Component
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
        this.methodInAppBio = this.methodInAppBio.bind(this);
    }

    componentDidMount() {
        (async () => {
            try {
                let response = await axios.post("/user");
                const { id, first, last, avatar, bio } = response.data.rows;
                this.setState({
                    id: id,
                    first: first,
                    last: last,
                    profilePicUrl: avatar,
                    bio: bio,
                });
            } catch (err) {
                console.log("error in axios post /user: ", err);
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

    render() {
        return (
            <BrowserRouter>
                <header className="app-header">
                    <Logo />
                    <div className="app-right">
                        <Link to="/users">Find People</Link>
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
                    <Route path="/users" render={() => <FindPeople />} />
                </section>

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
