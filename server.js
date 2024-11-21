import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(cors({
	origin: 'http://localhost:5173', // Replace with your frontend's origin
	credentials: true // Allow credentials to be sent with requests
}));

app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

setupSwagger(app);

const PORT = ENV_VARS.PORT;

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	console.log("Swagger API documentation available at: http://localhost:" + PORT + "/api-docs");
	connectDB();
});
