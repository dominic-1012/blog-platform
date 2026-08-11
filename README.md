# Blog Platform with Comments — Java Full Stack

A full-stack blogging platform built with **Spring Boot** (Java), **Spring Security + JWT**, **Spring Data JPA**, and a vanilla **HTML/CSS/JS** frontend served directly by the backend.

## Features
- User registration, login, and JWT-based authentication
- Create, edit, delete blog posts (only by their author)
- Comment on posts; delete your own comments
- RESTful JSON API backed by a relational database (H2 in-memory by default, MySQL-ready)
- Simple responsive frontend included — no separate frontend server needed

## Tech Stack
- Java 17, Spring Boot 3.2.5
- Spring Web, Spring Security, Spring Data JPA
- JWT (jjwt) for stateless auth
- H2 (dev) / MySQL (production-ready config included)
- Plain HTML/CSS/JavaScript frontend (in `src/main/resources/static`)

## Project Structure
```
blog-platform/
├── pom.xml
├── src/main/java/com/thiranex/blog/
│   ├── BlogApplication.java
│   ├── config/SecurityConfig.java
│   ├── security/          (JwtUtil, JwtAuthFilter, CustomUserDetailsService)
│   ├── model/              (User, Post, Comment entities)
│   ├── repository/         (Spring Data JPA repositories)
│   ├── dto/                 (request/response objects)
│   ├── controller/         (AuthController, PostController, CommentController)
│   └── exception/GlobalExceptionHandler.java
└── src/main/resources/
    ├── application.properties
    └── static/               (index.html, login.html, register.html, create-post.html, post.html, css/, js/)
```

## How to Run Locally

### Prerequisites
- Java 17+ (`java -version`)
- Maven 3.6+ (`mvn -version`) — or use the included wrapper if you add one
- (Optional) MySQL if you want a persistent database instead of the default in-memory H2

### Steps
1. Unzip the project and open a terminal in the `blog-platform` folder.
2. Run:
   ```bash
   mvn spring-boot:run
   ```
3. Open your browser to **http://localhost:8080**
4. Register an account, log in, and start posting.

That's it — the backend serves the frontend automatically, so there's nothing else to start.

> Note: H2 is in-memory, so data resets every time you restart the app. To persist data, switch to MySQL (see below).

### Using MySQL instead of H2
1. Install MySQL and create nothing manually — the app will auto-create the `blogdb` database.
2. In `src/main/resources/application.properties`, comment out the H2 block and uncomment the MySQL block, setting your own username/password.
3. Run `mvn spring-boot:run` again.

## API Reference (for testing with Postman/curl)

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register `{username, email, password}` |
| POST | `/api/auth/login` | No | Login `{username, password}` → returns JWT |
| GET | `/api/posts` | No | List posts (`?page=&size=&search=`) |
| GET | `/api/posts/{id}` | No | Get a single post |
| POST | `/api/posts` | Yes | Create post `{title, content}` |
| PUT | `/api/posts/{id}` | Yes (owner) | Update post |
| DELETE | `/api/posts/{id}` | Yes (owner) | Delete post |
| GET | `/api/posts/{id}/comments` | No | List comments on a post |
| POST | `/api/posts/{id}/comments` | Yes | Add comment `{content}` |
| DELETE | `/api/posts/{id}/comments/{commentId}` | Yes (owner) | Delete comment |

Send the JWT as `Authorization: Bearer <token>` on protected routes.

## Deploying it "live" on the internet (for your submission link)
Since this needs a real server to stay online, deploy it free on one of these:

**Railway.app** (easiest)
1. Push this project to a GitHub repo.
2. Go to railway.app → New Project → Deploy from GitHub repo.
3. Add a MySQL plugin in Railway, then set the datasource env vars (or application.properties) to point to it.
4. Railway builds with Maven automatically and gives you a public URL.

**Render.com**
1. Push to GitHub.
2. New → Web Service → connect the repo.
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/blog-platform-1.0.0.jar`
5. Add a free PostgreSQL/MySQL add-on and update `application.properties` (or use env vars) accordingly.

Both give you a public `https://your-app.onrender.com` or `.up.railway.app` link you can submit as your live project link.

## Notes for your project submission
- This satisfies the required key features: registration/login/auth, full CRUD on posts, a comment system, and a REST API + database backend.
- Passwords are hashed with BCrypt; auth uses stateless JWT tokens.
- Ownership checks prevent editing/deleting other users' posts or comments.
