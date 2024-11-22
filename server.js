import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from 'https';
import fs from 'fs';

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";

import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

// SSL configuration
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/tchserver.edwardxd.site/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tchserver.edwardxd.site/fullchain.pem')
};

// CORS configuration
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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

const PORT = 443; // HTTPS port

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Start server
https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on https://0.0.0.0:${PORT}`);
});
