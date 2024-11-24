import allowedOrigins from "../config/CORS/allowedOrigin.js";

const credentials = (req, res, next) => {
    next();
};

export default credentials;