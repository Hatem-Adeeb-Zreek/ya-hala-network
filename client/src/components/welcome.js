// import
import Register from "./register";

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
            <Register />
            <footer>
                <img src="background.png" alt="background" />
            </footer>
        </div>
    );
}
