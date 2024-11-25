import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";

import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

// Basic middleware
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// CORS pre-flight
app.options('*', cors({
    origin: ['https://tchmovie.edwardxd.site', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    optionsSuccessStatus: 204
}));

// CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tchmovie.edwardxd.site');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

setupSwagger(app);

const PORT = ENV_VARS.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
