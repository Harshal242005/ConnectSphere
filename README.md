# ConnectSphere

A social media backend API built with Node.js, Express, MongoDB, and Cloudinary.

## Features

- User registration & login with JWT cookie-based authentication
- Profile management (update name, profile picture, password)
- Follow / unfollow users
- Create posts and reels (with Cloudinary media uploads)
- Like / unlike posts
- Comment on posts (add & delete)
- Edit post captions
- Direct messaging between users
- Paginated feed

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Media Storage:** Cloudinary
- **Authentication:** JWT (httpOnly cookies)
- **Security:** Helmet, CORS, express-rate-limit

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Harshal242005/ConnectSphere.git
   cd ConnectSphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`.

5. Start the server:
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint    | Description         | Auth |
|--------|-------------|---------------------|------|
| POST   | `/register` | Register a new user | No   |
| POST   | `/login`    | Login               | No   |
| GET    | `/logout`   | Logout              | No   |

### Users (`/api/user`)

| Method | Endpoint          | Description                    | Auth |
|--------|-------------------|--------------------------------|------|
| GET    | `/me`             | Get current user profile       | Yes  |
| GET    | `/:id`            | Get user profile by ID         | Yes  |
| POST   | `/follow/:id`     | Follow / unfollow a user       | Yes  |
| GET    | `/followdata/:id` | Get followers & following data | Yes  |
| PUT    | `/:id`            | Update profile (name & photo)  | Yes  |
| POST   | `/:id`            | Update password                | Yes  |

### Posts (`/api/post`)

| Method | Endpoint        | Description                          | Auth |
|--------|-----------------|--------------------------------------|------|
| POST   | `/new`          | Create a post (use `?type=reel` for reels) | Yes  |
| GET    | `/all`          | Get all posts & reels (paginated: `?page=1&limit=10`) | Yes  |
| DELETE | `/:id`          | Delete a post                        | Yes  |
| POST   | `/like/:id`     | Like / unlike a post                 | Yes  |
| POST   | `/comment/:id`  | Add a comment                        | Yes  |
| DELETE | `/comment/:id`  | Delete a comment (`?commentId=...`)  | Yes  |
| PUT    | `/caption/:id`  | Edit post caption                    | Yes  |

### Messages (`/api/message`)

| Method | Endpoint | Description                  | Auth |
|--------|----------|------------------------------|------|
| POST   | `/`      | Send a message               | Yes  |
| GET    | `/:id`   | Get all messages with a user | Yes  |

## Environment Variables

| Variable           | Description                  |
|--------------------|------------------------------|
| `PORT`             | Server port (default: 3000)  |
| `MONGO_URL`        | MongoDB connection string    |
| `JWT_SECRET`       | Secret key for JWT signing   |
| `Cloudinary_Name`  | Cloudinary cloud name        |
| `Cloudinary_Api`   | Cloudinary API key           |
| `Cloudinary_Secret`| Cloudinary API secret        |
| `FRONTEND_URL`     | Allowed CORS origin          |

## License

ISC
