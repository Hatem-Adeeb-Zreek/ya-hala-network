// Import
import ReactDOM from "react-dom";
import Welcome from "./components/welcome";
import App from "./components/app";

// to check if the user logged in
let elem;
const userIsLoggedIn = location.pathname != "/welcome";

// If Statement to render
if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    elem = (
        <div className="start-wrapper">
            <App />
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
