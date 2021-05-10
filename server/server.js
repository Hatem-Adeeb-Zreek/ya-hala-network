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
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

// app.use
app.use(
    cookieSession({
        secret: cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    res.set("x-frame-options", "DENY");
    next();
});
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
        hash(password)
            .then((hashedPw) => {
                db.createUser(firstname, lastname, email, hashedPw)
                    .then((results) => {
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        if (err.constraint == "users_email_key") {
                            res.json({
                                success: false,
                                message: "This Email is Already in Use",
                            });
                        } else {
                            console.log(
                                "error in POST /register createUser()",
                                err
                            );
                        }
                    });
            })
            .catch((err) => {
                console.log("error is POST /register hash()", err);
            });
    } else {
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "make sure your form is complete!",
        });
    }
});

// Post Route for Log In
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        db.getUserDataByEmail(email)
            .then((results) => {
                const hashedPw = results.rows[0].password;
                compare(password, hashedPw)
                    .then((match) => {
                        if (match) {
                            req.session.userId = results.rows[0].id;
                            console.log("successful log in!");
                            res.json({ success: true });
                        } else {
                            console.log("error! no match passwords");
                            res.json({
                                success: false,
                                message: "Failed to Log In",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in POST /login compare():", err);
                        res.json({
                            success: false,
                            message: "Server Error",
                        });
                    });
            })
            .catch((err) => {
                console.log("error in POST /login getUserDataByEmail():", err);
                res.json({
                    success: false,
                    message: "Failed to Log In",
                });
            });
    } else {
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "these Fields are mandatory!",
        });
    }
});

// Post Route for Reset Password
app.post("/password/reset/old", (req, res) => {
    const { email } = req.body;
    if (email) {
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length > 0) {
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.storeCode(secretCode, email)
                        .then(() => {
                            const emailSubject =
                                "Your Request to reset Password";
                            const emailMessage = `
                                Please use the Verification Code below to reset your Password:
                                ${secretCode}
                                Please note: This Code expires after 10 Minutes.
                                `;
                            ses.sendEmail(email, emailMessage, emailSubject)
                                .then(() => {
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log("error in ses.sendEmail:", err);
                                    res.json({
                                        success: false,
                                        message:
                                            "Server Error. Please Try Again",
                                    });
                                });
                        })
                        .catch((err) => {
                            console.log(
                                "error in POST /password/reset/old storeCode()",
                                err
                            );
                            res.json({
                                success: false,
                                message: "Server Error. Please Try Again",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        message: "Email was Not Found, Try Again",
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "error in POST /password/reset/old getUserDataByEmail():",
                    err
                );
                res.json({
                    success: false,
                    message: "Server Error. Please Try Again",
                });
            });
    } else {
        res.json({
            success: false,
            message: "Please Enter your Email Address",
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
