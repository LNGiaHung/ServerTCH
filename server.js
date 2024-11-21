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

const app = express();

app.use(cors({
	origin: 'http://localhost:5173', // Replace with your frontend's origin
	credentials: true // Allow credentials to be sent with requests
}));

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

app.use("/api/v1/auth", authRoutes); // Authentication routes
app.use("/api/v1/movies", movieRoutes); // Movie routes
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", searchRoutes);

setupSwagger(app); // Set up Swagger documentation

const PORT = ENV_VARS.PORT;

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	console.log("Swagger API documentation available at: http://localhost:" + PORT + "/api-docs");
	connectDB(); // Connect to the database
});
