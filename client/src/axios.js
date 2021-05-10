// import axios
import axios from "axios";

// create instance from axios
var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token",
});

export default instance;
