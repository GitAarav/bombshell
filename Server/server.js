import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import admin from "firebase-admin";
import verifyFirebaseToken from "./middleware/verifyFirebaseToken.js";

dotenv.config();

// Get the service account string from .env
const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
let serviceAccount;

try {
    // Try to parse it directly
    serviceAccount = JSON.parse(serviceAccountStr);
} catch (error) {
    // If there's an error, log it for debugging
    console.error("Error parsing service account:", error.message);
    console.log("Service account string:", serviceAccountStr);
    
    // Exit the process to prevent starting with invalid configuration
    process.exit(1);
}

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

console.log("firebase app initialized successfully");

const app = express();
app.use(express.json());
app.use(cors({}));

// Connect MongoDB
connectDB();

// Protected endpoint using middleware
app.get("/api/user-profile", verifyFirebaseToken, (req, res) => {
    res.json({
        message: "Authentication successful",
        userId: req.user.uid,
        email: req.user.email,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));