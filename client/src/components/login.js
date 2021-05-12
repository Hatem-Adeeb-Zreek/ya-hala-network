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
            <div className="form-container">
                <h1>Please Log In</h1>
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
                    log in
                </button>
                {this.state.error && (
                    <h1 className="errMsg">{this.state.message}</h1>
                )}

                <h3 className="login">
                    Not Yet a Member?
                    <Link to="/" className="link">
                        register
                    </Link>
                </h3>
                <h3 className="login">
                    Forgot your Password? Click to
                    <Link to="/reset-password" className="link">
                        reset
                    </Link>
                </h3>
            </div>
        );
    }
}
