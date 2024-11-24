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

// Custom CORS middleware
app.use((req, res, next) => {
    // Remove any existing CORS headers
    res.removeHeader('Access-Control-Allow-Origin');
    res.removeHeader('Access-Control-Allow-Credentials');
    res.removeHeader('Access-Control-Allow-Methods');
    res.removeHeader('Access-Control-Allow-Headers');
    
    // Set our own headers
    res.header('Access-Control-Allow-Origin', 'https://tchmovie.edwardxd.site');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Built-in middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

setupSwagger(app); // Set up Swagger documentation

const PORT = ENV_VARS.PORT;

app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
    console.log("Swagger API documentation available at: http://localhost:" + PORT + "/api-docs");
    connectDB(); // Connect to the database
});
