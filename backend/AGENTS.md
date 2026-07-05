# AI Agent Guidelines & Architecture - Backend (Express.js + MongoDB)

This document defines the architecture, coding standards, and development guidelines for the Backend of the **Todo Management System**. Every AI agent working on this project must follow these conventions.

---

# 1. Technology Stack

* Runtime: Node.js v18+
* Framework: Express.js
* Database: MongoDB Atlas (Mongoose ODM)
* Authentication: JWT + bcryptjs (if authentication is required)
* Image Storage: Cloudinary
* File Upload: Multer (memoryStorage)
* HTTP Logging: Morgan
* Environment Variables: dotenv
* CORS: cors

---

# 2. Project Architecture

The project must follow a layered architecture.

```text
backend/
├── src/
│
├── config/
│   ├── database.js
│   └── cloudinary.js
│
├── controllers/
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── upload.middleware.js
│   ├── validation.middleware.js
│   └── notFound.middleware.js
│
├── models/
│
├── routes/
│
├── services/
│
├── utils/
│   ├── cloudinary.js
│   ├── response.js
│   └── validators.js
│
├── app.js
│
server.js
.env.example
package.json
```

Business logic must never be placed inside routes.

Controllers should only receive requests, call services, and return responses.

---

# 3. Coding Principles

* Use async/await.
* Keep functions small.
* Follow Single Responsibility Principle.
* Avoid duplicated code.
* Prefer reusable utilities.
* Never access MongoDB directly from routes.
* Never upload files directly inside controllers.

---

# 4. REST API

Design RESTful APIs.

Example:

```text
GET     /api/tasks

GET     /api/tasks/:id

POST    /api/tasks

PUT     /api/tasks/:id

DELETE  /api/tasks/:id

PATCH   /api/tasks/:id/toggle
```

If image upload is supported:

```text
POST /api/upload
```

or

```text
POST /api/tasks
```

using multipart/form-data.

---

# 5. Response Format

Every API must return a consistent response.

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

---

# 6. Validation

Validate every request.

Examples:

* Required fields
* Empty string
* Whitespace-only input
* Invalid ObjectId
* Invalid request body
* Missing multipart file
* Unsupported image format
* Image size limit

Return proper HTTP status codes.

---

# 7. Image Upload

The project supports image uploads.

Requirements:

* Use Multer with memoryStorage.
* Upload images to Cloudinary.
* Never store image files locally.
* Save only the Cloudinary `secure_url` (and `public_id` if needed) in MongoDB.
* Restrict uploads to image MIME types only.
* Handle upload failures gracefully.

Image upload logic must be isolated from controllers and implemented in reusable services or utilities.

---

# 8. Cloudinary Configuration

Create a dedicated configuration file.

```text
src/config/cloudinary.js
```

Read credentials from environment variables.

Required variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never hardcode credentials.

---

# 9. Database

Use Mongoose models only.

Enable timestamps.

Use schema validation.

Prefer indexes where appropriate.

---

# 10. Error Handling

Use centralized error handling middleware.

Every unexpected error must return JSON.

Never expose internal stack traces in production.

---

# 11. Environment Variables

Required variables:

```env
PORT=
MONGODB_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Provide a `.env.example`.

Never commit `.env`.

---

# 12. Code Quality

The generated code must be:

* Production-ready
* Readable
* Maintainable
* Modular
* Well-structured
* Consistent

Avoid unnecessary abstractions while keeping the architecture scalable.

Always follow the folder structure and conventions defined in this document.
