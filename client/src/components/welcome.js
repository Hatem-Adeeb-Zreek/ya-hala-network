// import
import Register from "./register";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./reset-password";

// Welcome Function Component
export default function Welcome() {
    return (
        <div>
            <div className="welcome">
                <h1>WELCOME TO</h1>
                <img src="logo.png" alt="logo" id="logo" />
                <h2 id="h2-margin">
                    Stay connected with friends, family, and colleagues.
                </h2>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </div>
            </HashRouter>
            <footer>
                <img src="background.png" alt="background" />
            </footer>
        </div>
    );
}
