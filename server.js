import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";
import userRoutes from "./routes/user.routes.js";

import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

// Basic middleware
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['https://tchmovie.edwardxd.site', 'http://localhost:5173'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Enable pre-flight for all routes
app.options('*', cors(corsOptions));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/tvs", tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/user", userRoutes);

setupSwagger(app);

const PORT = ENV_VARS.PORT || 5000;

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
