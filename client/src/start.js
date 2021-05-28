// import modules
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";

// import components
import Welcome from "./components/welcome";
import App from "./components/app";

// create store for Redux
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

// to check if the user logged in
let elem;
const userIsLoggedIn = location.pathname != "/welcome";

// If statement to render
if (!userIsLoggedIn) {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <div className="start-wrapper">
                <App />
            </div>
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
