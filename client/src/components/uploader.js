// import modules
import React from "react";
import axios from "../axios";
let formdataUrl;

// Uploader Class Component
export default class Uploader extends React.Component {
    constructor(props) {
        super();
        this.state = {
            imgUrl: props.profilePicUrl,
            file: null,
        };
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    methodInUploader() {
        this.props.methodInApp(this.state.imgUrl);
    }

    handleFileChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    submit() {
        let formData = new FormData();
        formData.append("file", this.state.file);
        (async () => {
            try {
                let response = await axios.post("/upload/profilepic", formData);
                let { returnedUrl } = response.data;
                this.setState({ imgUrl: returnedUrl });
                this.methodInUploader();
            } catch (err) {
                console.log("error in axios POST /upload/profilepic:", err);
            }
        })();
    }

    render() {
        return (
            <div className="uploader-wrapper">
                <h2>Click below to Update your Profile Picture</h2>
                <input
                    type="file"
                    name="file"
                    placeholder="choose image"
                    accept="image/*"
                    onChange={this.handleFileChange}
                    id="file"
                ></input>
                <label htmlFor="file">choose an Avatar</label>
                <button onClick={() => this.submit()} className="bio-btn">
                    Upload
                </button>
            </div>
        );
    }
}
