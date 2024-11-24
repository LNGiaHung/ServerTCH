import allowedOrigins from "../config/CORS/allowedOrigin.js";

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', origin);
    }
    next();
};

export default credentials;