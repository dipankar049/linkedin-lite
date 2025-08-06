# LinkedIn Lite 🧑‍💼⚡

A lightweight full-stack LinkedIn clone built with **Next.js App Router**, **MongoDB**, and **Tailwind CSS**.  
Supports user authentication, creating posts, liking, commenting, and profile viewing.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 🧾 Create & view posts
- ❤️ Like and 💬 comment on posts
- 👤 User profiles with their posts
- ♾️ Infinite scroll (optional)
- 🎨 Stylish & responsive UI with Tailwind CSS

---

## 🧑‍💻 Tech Stack

- **Frontend & Backend**: Next.js (App Router, API Routes)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + HttpOnly Cookies
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## 📁 Project Structure

```
/app                # App router directory (routes, layouts)
/components         # Reusable UI components (PostCard, Form, etc.)
/models             # Mongoose models (User, Post)
/lib                # DB connection, auth utilities
/context            # Authentication Context
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/dipankar049/linkedin-lite.git
cd linkedin-lite
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the app locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 API Routes (App Router)

| Route                       | Method | Description                |
|----------------------------|--------|----------------------------|
| `/api/register`            | POST   | Register a new user        |
| `/api/login`               | POST   | Login with credentials     |
| `/api/posts`               | GET    | Fetch all posts            |
| `/api/posts/new`           | POST   | Create a new post          |
| `/api/posts/:id/like`      | PATCH  | Like or unlike a post      |
| `/api/posts/:id/comment`   | POST   | Add comment to a post      |
| `/api/users/:id/posts`     | GET    | Get posts by a user        |
