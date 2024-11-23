import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

// Dynamically set the allowed origin
const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests from specific origin
		if (origin === 'https://tchmovie.edwardxd.site') {
			callback(null, origin); // Allow the requesting origin
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // Allow credentials (cookies, authorization headers)
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

app.use("/api/v1/auth", authRoutes); // Authentication routes
app.use("/api/v1/movies", movieRoutes); // Movie routes
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

setupSwagger(app); // Set up Swagger documentation

const PORT = ENV_VARS.PORT;

app.listen(PORT, () => {
	console.log("Server started at http://44.196.160.2:" + PORT);
	console.log("Swagger API documentation available at: http://44.196.160.2:" + PORT + "/api-docs");
	connectDB(); // Connect to the database
});
