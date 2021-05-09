// import
import React from "react";
import axios from "axios";

// Register Class Component
export default class Register extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    clearErrMsg() {
        this.setState({
            error: false,
        });
    }

    submit() {
        axios
            .post("/register", this.state)
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
            .catch((e) => console.log("error in axios post /register", e));
    }

    render() {
        return (
            <div className="form-container">
                <h2>Join Ya Hala!!</h2>
                {this.state.error && (
                    <h1 className="errMsg">{this.state.message}</h1>
                )}
                <input
                    name="firstname"
                    placeholder="First Name *"
                    autoComplete="off"
                    pattern="^[a-zA-Z ]+$"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
                <input
                    name="lastname"
                    placeholder="Last Name *"
                    autoComplete="off"
                    pattern="^[a-zA-Z ]+$"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.clearErrMsg()}
                ></input>
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
                <button onClick={() => this.submit()}>register</button>
                <h2>already a member? log in...</h2>
            </div>
        );
    }
}
