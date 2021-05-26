// import modules
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3001") ||
                req.headers.referer.startsWith(
                    "https://hatem-social-network.herokuapp.com"
                )
        ),
});
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { cookieSecret } = require("./secrets.json");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

/////// MULTER ////////
const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24)
            .then(function (uid) {
                callback(null, uid + path.extname(file.originalname));
            })
            .catch((err) => {
                console.log("error in multerdiskstorage: ", err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152,
    },
});

// app.use
const cookieSessionMiddleware = cookieSession({
    secret: cookieSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
                                message: "🛑 This Email is Already in Use 🛑",
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
            message: "🛑 Make sure your Form is Complete 🛑",
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
                                message: "🛑 Failed to login 🛑",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in POST /login compare():", err);
                        res.json({
                            success: false,
                            message: " 🛑 Server Error 🛑",
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
            message: " 🛑 All Fields are mandatory 🛑",
        });
    }
});

// Post Route for Reset Old Password
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

// Post Route for Reset Password
app.post("/password/reset/start", async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (email) {
        try {
            let checkEmail = await db.getUserDataByEmail(email);
            if (checkEmail.rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                await db.storeCode(secretCode, email);
                const first = checkEmail.rows[0].first;
                const emailSubject = "Your Request to Reset The Login Password";
                const emailMessage = `
                Hello, ${first}!
                Please use the Verification Code below to Reset your Password:
                ${secretCode}
                Please Note: This Verification Code expires after 10 minutes!
                `;
                //
                await ses.sendEmail(email, emailMessage, emailSubject);
                res.json({ success: true });
            } else {
                res.json({
                    success: false,
                    message: "🛑 Email Address was Not Found, Try Again 🛑",
                });
            }
        } catch (err) {
            if (err.message.startsWith("Invalid Domain Name")) {
                console.log("error in ses.sendEmail(): ", err);
            } else {
                console.log(err);
            }
            res.json({
                success: false,
                message: " 🛑 Server Error. Please Try Again 🛑",
            });
        }
    } else {
        res.json({
            success: false,
            message: "🛑 PLZ, provide us your Email 🛑",
        });
    }
});

// Post Route to Verify
app.post("/password/reset/verify", async (req, res) => {
    const { email, secretCode, password } = req.body;
    if (secretCode && password) {
        try {
            let checkCode = await db.checkCode(email);
            if (checkCode.rows.length > 0) {
                if (checkCode.rows[0].code === secretCode) {
                    let hashedPw = await hash(password);
                    await db.updatePw(hashedPw, email);
                    res.json({ success: true });
                } else {
                    res.json({
                        success: false,
                        message:
                            " 🛑 Recovery Verification Code doesn't Match or Expired. Please Try again or Request a New Verification Code 🛑",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message:
                        " 🛑 Recovery Verification Code doesn't Match or Expired. Please Try again or Request a nNew Verification Code 🛑",
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: " 🛑 Server Error. Please Try Again 🛑",
            });
        }
    } else {
        res.json({
            success: false,
            message: " 🛑 These Fields are Mandatory 🛑",
        });
    }
});

// post Route for User   post ------ get
app.get("/user", async (req, res) => {
    const { userId } = req.session;
    try {
        let userData = await db.getUserDataById(userId);
        let rows = userData.rows[0];
        res.json({ rows });
    } catch (err) {
        console.log("error in get/user", err);
    }
});

// Post Route for Profile Picture
app.post(
    "/upload/profilepic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        if (req.file) {
            const { userId } = req.session;
            const url = `${s3Url}${req.file.filename}`;
            try {
                let results = await db.uploadPicture(url, userId);
                let returnedUrl = results.rows[0].avatar;
                res.json({ returnedUrl });
            } catch (err) {
                console.log("error in post/upload/profilepic", err);
                res.json({
                    success: false,
                    message: "Server Error. Please Try Again",
                });
            }
        } else {
            res.json({
                success: false,
                message: "No File was Chosen",
            });
        }
    }
);

// Post Route for Bio
app.post("/upload/bio", async (req, res) => {
    const { userId } = req.session;
    const { biotext } = req.body;
    try {
        let results = await db.updateBio(biotext, userId);
        let returnedBio = results.rows[0].bio;
        res.json({ returnedBio });
    } catch (err) {
        console.log("error in post/upload/bio", err);
        res.json({
            success: false,
            message: "Server Error. Please Try Again",
        });
    }
});

// post Route for other Users  post ------ get
app.get("/user/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    if (otherId > 0) {
        try {
            let otherProfileData = await db.getUserDataById(otherId);
            let rows = otherProfileData.rows[0];
            if (otherId == userId) {
                res.json({
                    rows,
                    match: true,
                    ownId: userId,
                });
            } else {
                res.json({
                    rows,
                    match: false,
                });
            }
        } catch (err) {
            console.log("Error in get user/:id", err);
        }
    } else {
        res.json({ rows: null });
    }
});

// post route for users  post ----- get
app.post("/users", async (req, res) => {
    try {
        let { rows } = await db.getMostRecent();
        res.json(rows);
    } catch (err) {
        console.log("Error in get users", err);
    }
});

// post route for search for users  post ---- get
app.post("/users/:search", async (req, res) => {
    const { search } = req.params;
    try {
        let { rows } = await db.searchUser(search);
        res.json(rows);
    } catch (err) {
        console.log("Error in get users/:id", err);
    }
});

// post ---- get
app.get("/checkFriendStatus/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    try {
        let { rows } = await db.getFriendshipStatus(userId, otherId);
        rows.length == 0
            ? res.json({ btnText: "Send Friend Request" })
            : rows[0].accepted
            ? res.json({ btnText: "Unfriend" })
            : rows[0].sender_id == userId
            ? res.json({ btnText: "Cancel Friend Request" })
            : res.json({ btnText: "Accept Friend Request" });
    } catch (err) {
        console.log("Error in app get checkFriendStatus/:otherId", err);
    }
});

// post route for set friendship
app.post("/setFriendship/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    const { action } = req.body;
    try {
        let { rows } = await db.getFriendshipStatus(userId, otherId);
        rows.length == 0
            ? await db.sendFriendship(userId, otherId)
            : rows[0].accepted ||
              (!rows[0].accepted && rows[0].sender_id == userId) ||
              action === "reject"
            ? await db.deleteFriendship(userId, otherId)
            : await db.acceptFriendship(userId, otherId);
        res.json({ success: true });
    } catch (err) {
        console.log("Error in app post setFriendship/:otherId", err);
    }
});

// Get Friends Route
app.get("/getFriends", async (req, res) => {
    const { userId } = req.session;
    try {
        let myRequests = new Array(),
            friendsWannabes = new Array();
        let { rows } = await db.getFriendsAndWannabes(userId);
        rows.forEach((row) => {
            !row.accepted && row.sender_id == userId
                ? myRequests.push(row)
                : friendsWannabes.push(row);
        });
        res.json({ myRequests, friendsWannabes });
    } catch (err) {
        console.log("Error in app GET getFriends", err);
    }
});

// Get logout Route
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("*");
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

server.listen(process.env.PORT || 3001, () => {
    console.log("Ya Hala Network Server listening to PORT 3001");
});

// socket    section ///////
io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const { userId } = socket.request.session;
    console.log(`connected socket id (${socket.id}) / userId (${userId})`);

    try {
        let data = await db.getMsgBrdHistory();
        let payload = data.rows.reverse();
        io.emit("mbdbHistory", payload);
    } catch (err) {
        console.log("Error in SOCKET io.emit mbdbHistory", err);
    }

    socket.on("newMsgFromClient", async (newMsg) => {
        console.log(`userId ${userId} just added this message: ${newMsg}`);
        try {
            await db.addBoardMessage(userId, newMsg);
            let data = await db.getMsgBrdHistory();
            let payload = data.rows.reverse();
            io.emit("mbdbHistory", payload);
        } catch (err) {
            console.log("Error in SOCKET io.emit newMsgFromClient", err);
        }
    });
    socket.on("disconnect", () => {
        console.log(`disconnected! (${socket.id}) / userId (${userId})`);
    });
});
