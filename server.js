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

// Trust proxy settings for Cloudflare and Caddy
app.set('trust proxy', true);

// CORS configuration for Cloudflare
app.use(cors({
    origin: 'https://tchserver.edwardxd.site',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Built-in middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

setupSwagger(app); // Set up Swagger documentation

const PORT = ENV_VARS.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (Proxied through Caddy and Cloudflare)`);
    connectDB();
});
