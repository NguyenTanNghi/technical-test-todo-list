const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
];

function validateEnvironment() {
    const missing = requiredEnvVars.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`,
        );
    }
}

async function startServer() {
    validateEnvironment();
    await connectDatabase(process.env.MONGODB_URI);

    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});
