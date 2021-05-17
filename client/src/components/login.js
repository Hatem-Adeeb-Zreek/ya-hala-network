// import modules
import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

// Login Class Component
export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    clearErrMsg() {
        this.setState({ error: false });
    }

    submit() {
        axios
            .post("/login", this.state)
            .then((response) => {
                if (response.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                        message: response.data.message,
                    });
                }
            })
            .catch((e) => console.log("error in axios post /login", e));
    }

    render() {
        return (
            <div className="info">
                <h1>Please login</h1>
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
                <input
                    name="password"
                    placeholder="Password *"
                    autoComplete="off"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
                <button name="submit" onClick={() => this.submit()}>
                    login
                </button>
                <h3>
                    Not Yet a Member?
                    <Link to="/">register</Link>
                </h3>
                <h3>
                    Forgot your Password?
                    <Link to="/reset-password">reset</Link>
                </h3>
            </div>
        );
    }
}
