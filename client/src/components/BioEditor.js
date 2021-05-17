// import modules
import { Component } from "react";
import axios from "../axios";

// BioEditor Class Component
export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsVisible: false,
            draftBio: null,
        };
    }

    methodInBioEditor() {
        this.props.methodInAppBio(this.state.draftBio);
    }

    handleChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }

    textareaToggle() {
        this.setState({
            editorIsVisible: !this.state.editorIsVisible,
        });
        if (this.state.editorIsVisible) {
            if (this.state.draftBio == null) {
                return;
            } else {
                let bioObj = { biotext: this.state.draftBio };
                (async () => {
                    try {
                        let response = await axios.post("/upload/bio", bioObj);
                        let { returnedBio } = response.data;
                        this.setState({ draftBio: returnedBio });
                        this.methodInBioEditor();
                    } catch (err) {
                        console.log("error in axios POST /upload/bio:", err);
                    }
                })();
            }
        }
    }

    render() {
        return (
            <div>
                <p className="bio-text">
                    <strong>Bio: </strong>
                    {this.props.bio || "your Bio is empty."}
                </p>
                {this.state.editorIsVisible && (
                    <textarea
                        autoFocus={true}
                        defaultValue={this.props.bio}
                        rows="3"
                        cols="100"
                        onChange={(e) => this.handleChange(e)}
                    />
                )}

                <button
                    onClick={() => this.textareaToggle()}
                    className="bio-btn"
                >
                    {this.state.editorIsVisible
                        ? "save"
                        : this.props.bio
                        ? "edit Bio"
                        : "add Bio"}
                </button>
            </div>
        );
    }
}
