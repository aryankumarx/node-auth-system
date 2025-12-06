# Node.js Authentication & File Upload System

A robust backend application demonstrating **Role-Based Access Control (RBAC)** and **Secure File Uploads** using Node.js, Express, MongoDB, and Cloudinary.

## 🚀 Features

### 1. Authentication & Security
* **User Registration & Login:** Secure authentication using JWT (JSON Web Tokens).
* **Password Hashing:** Passwords are hashed using `bcryptjs` before storage.
* **Role-Based Access Control (RBAC):**
    * `User`: Can access public and protected home routes.
    * `Admin`: Exclusive access to admin dashboards.
* **Protected Routes:** Middleware to verify tokens and roles.

### 2. File Upload System
* **Image Upload:** Users can upload images via `Multer`.
* **Cloud Storage:** Images are automatically uploaded to **Cloudinary** for scalable storage.
* **Database Linking:** Image URLs and Public IDs are stored in MongoDB linked to the uploading user.
* **Local Cleanup:** Temporary server files are deleted automatically after successful cloud upload.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT, Bcryptjs
* **File Handling:** Multer, Cloudinary

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```



## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | `{ "username": "...", "email": "...", "password": "...", "role": "user" }` |
| `POST` | `/api/auth/login` | Login user | `{ "username": "...", "password": "..." }` |

### 🏠 Home & Admin (Protected)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/home/welcome` | Welcome message for logged-in users | ✅ Yes (Token) |
| `GET` | `/api/admin/welcome` | Welcome message for Admins only | ✅ Yes (Token + Admin Role) |

### 🖼️ Image Upload
| Method | Endpoint | Description | Form-Data Key |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/image/upload` | Upload image to Cloudinary | Key: `image`, Value: `(file)` |
| `GET` | `/api/image/get` | Get all images uploaded by user | N/A |

### 🖼️ Image Routes
| Method | Endpoint | Description | Query Params (Optional) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/image/upload` | Upload image to Cloudinary | N/A |
| `GET` | `/api/image/get` | Get user images | `?page=1&limit=5&sortBy=createdAt` |
| `DELETE` | `/api/image/delete/:id` | **Admin Only** delete image | N/A |

## 🚀 Live Demo
Check out the live version of the project here: [Live App Link](https://node-auth-system-0xcu.onrender.com)
> **Note:** The server allows image uploads for testing. Since this is hosted on a free instance, it may take 30-60 seconds to load initially (Cold Start).
