// Import
import ReactDOM from "react-dom";
import Welcome from "./components/welcome";

// to check if the user logged in
let elem;
const userIsLoggedIn = location.pathname != "/welcome";

// If Statement to render
if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    elem = (
        <div>
            <img src="logo.png" alt="logo" id="small-logo" />
            <footer>
                <img src="background.png" alt="background" />
            </footer>
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
