import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import adminRoute from "./routes/admin.routes.js";
import historiqueRoute from "./routes/historique.route.js";

const app = express();

const allowedOrigins = [
  "https://burundi-location-maison1.onrender.com",
  "https://burundi-location-1.onrender.com",
  "https://burundi-location-3.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://burundi-location-maison1.onrender.com",
        "https://burundi-location-1.onrender.com",
        "https://burundi-location-3.onrender.com"
      ];
      
      // Allow requests with no origin (like mobile apps or postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // This is crucial for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
  })
);

// Handle preflight requests properly
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Your routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/admin", adminRoute);
app.use("/api/historique", historiqueRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

const PORT = process.env.PORT || 8800;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
});