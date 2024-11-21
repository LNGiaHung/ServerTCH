import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(cors({
	origin: 'http://localhost:5173', // Replace with your frontend's origin
	credentials: true // Allow credentials to be sent with requests
}));

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser());


setupSwagger(app);

app.listen(PORT, () => {
	console.log("Server started at http://3.222.169.78:" + PORT);
	console.log("Swagger API documentation available at: http://3.222.169.78:" + PORT + "/api-docs");
	connectDB();
});
