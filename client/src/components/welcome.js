// import
import Register from "./register";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./reset-password";

// Welcome Function Component
export default function Welcome() {
    return (
        <>
            <section className="section1">
                <video src="YA HALA(1).mp4" autoPlay loop></video>
                <h2>Stay connected with friends, family, and colleagues.</h2>
            </section>
            <HashRouter>
                <section className="section2">
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </section>
            </HashRouter>
            {/* <footer>
                <img src="background.png" alt="background" />
            </footer> */}
        </>
    );
}
