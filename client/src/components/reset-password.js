import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.state.step = "provideEmail";
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    clearErrMsg() {
        this.setState({ error: false });
    }

    submitEmail() {
        axios
            .post("/password/reset/start", this.state)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        step: "provideCodePW",
                    });
                    this.clearErrMsg();
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((err) =>
                console.log("error in axios post /password/reset/start", err)
            );
    }

    submitNewPw() {
        axios
            .post("/password/reset/verify", this.state)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        step: "",
                    });
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((err) =>
                console.log("error in axios post /password/reset/verify", err)
            );
    }

    getCurrentDisplay() {
        const step = this.state.step;
        if (step == "provideEmail") {
            return (
                <div className="form-container">
                    <h1>Please Enter Your Email</h1>
                    <input
                        name="email"
                        placeholder="Email Address *"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitEmail()}>
                        reset
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                </div>
            );
        } else if (step == "provideCodePW") {
            return (
                <div className="form-container">
                    <h3>Recovery Email was Sent</h3>
                    <input
                        name="secretCode"
                        placeholder="Recovery Code *"
                        autoComplete="off"
                        key={this.state.step}
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <input
                        name="password"
                        placeholder="New Password *"
                        autoComplete="off"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitNewPw()}>
                        submit
                    </button>
                    {this.state.error && (
                        <h1 className="errMsg">{this.state.message}</h1>
                    )}
                </div>
            );
        } else {
            return (
                <div className="form-container">
                    <h1>Password Reset Successfully</h1>
                    <div className="formLower">
                        <h3>now you can go ahead</h3>
                        <h3>
                            and <Link to="/login"> login</Link>
                        </h3>
                    </div>
                </div>
            );
        }
    }

    render() {
        return <div> {this.getCurrentDisplay()} </div>;
    }
}
