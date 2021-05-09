// import modules
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { cookieSecret } = require("./secrets.json");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const db = require("./db");

// app.use
app.use(
    cookieSession({
        secret: cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// Routes

// GET Route to serve welcome Route
app.get("/welcome", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// POST Route for register a new user
app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (firstname && lastname && email && password) {
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length == 0) {
                    console.log("email is good to use!");
                    hash(password)
                        .then((hashedPw) => {
                            db.createUser(firstname, lastname, email, hashedPw)
                                .then((results) => {
                                    req.session.userId = results.rows[0].id;
                                    console.log("a new user was added!");
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log(
                                        "error in POST /register createUser()",
                                        err
                                    );
                                });
                        })
                        .catch((err) => {
                            console.log("error is POST /register hash()", err);
                        });
                } else {
                    console.log("error! email has been already used");
                    res.json({
                        success: false,
                        message: "this email is already in use",
                    });
                }
            })
            .catch((err) => {
                console.log("error is POST /register checkEmail()", err);
            });
    } else {
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "make sure your form is complete!",
        });
    }
});

// GET * Route
app.get("*", function (req, res) {
    const { userId } = req.session;
    if (!userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("Ya Hala Network Server listening to PORT 3001");
});
