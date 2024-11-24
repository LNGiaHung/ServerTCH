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

// // CORS configuration
// app.use(cors({
//     origin: /\.edwardxd\.site$/,  // Allow all subdomains of edwardxd.site
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//     exposedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     preflightContinue: false,
//     optionsSuccessStatus: 204
// }));

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
