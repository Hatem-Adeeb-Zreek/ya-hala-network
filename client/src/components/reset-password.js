// import modules
import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

// ResetPassword class component
export default class ResetPassword extends React.Component {
    // ResetPassword constructor
    constructor() {
        super();
        this.state = {};
        this.state.step = "provideEmail";
    }

    // ResetPassword methods
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
            // ResetPassword render
            return (
                <div className="info">
                    <h1>Please Enter Your Email</h1>
                    {this.state.error && (
                        <h1 className="err">{this.state.message}</h1>
                    )}
                    <input
                        name="email"
                        placeholder="Email Address *"
                        autoComplete="off"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.clearErrMsg()}
                    ></input>
                    <button name="submit" onClick={() => this.submitEmail()}>
                        Send Email
                    </button>
                </div>
            );
        } else if (step == "provideCodePW") {
            return (
                <div className="info">
                    <h1>Recovery Email was Sent</h1>
                    {this.state.error && (
                        <h1 className="err">{this.state.message}</h1>
                    )}
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
                        Reset Password
                    </button>
                </div>
            );
        } else {
            return (
                <div className="info">
                    <h1>Password Reset Successfully</h1>

                    <h3>
                        <Link to="/login"> login</Link>
                        with your new password
                    </h3>
                </div>
            );
        }
    }

    render() {
        return <div> {this.getCurrentDisplay()} </div>;
    }
}
