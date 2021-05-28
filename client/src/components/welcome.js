// import modules
import { HashRouter, Route } from "react-router-dom";

// import components
import Register from "./register";
import Login from "./login";
import ResetPassword from "./reset-password";

// Welcome function component
export default function Welcome() {
    // Welcome render
    return (
        <>
            <section className="section1">
                <video src="YA_HALA1.mp4" autoPlay loop></video>
                <h2>Stay connected with friends, family, and colleagues.</h2>
            </section>
            <HashRouter>
                <section className="section2">
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </section>
            </HashRouter>
        </>
    );
}
