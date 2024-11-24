import allowedOrigins from "./allowedOrigin.js";

const corsOptions = {
    origin: 'https://tchmovie.edwardxd.site',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
};

export default corsOptions;