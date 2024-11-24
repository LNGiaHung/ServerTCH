import allowedOrigins from "./allowedOrigin.js";

const corsOptions = {
  origin: true, // Let Nginx handle CORS
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'Content-Type', 'DNT', 'If-Modified-Since', 'Keep-Alive', 'Origin', 'User-Agent', 'X-Requested-With'],
  preflightContinue: false
};

export default corsOptions;