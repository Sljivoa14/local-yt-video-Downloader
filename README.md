# 📥 YouTube Downloader (Node.js)

A beginner-friendly YouTube downloader built with **Node.js**, **Express**, and **yt-dlp**.

The purpose of this project was **not only to download YouTube videos**, but also to understand how modern web applications work under the hood by building both the frontend and backend from scratch.

---

# Goals

During this project:

* Building a backend using Node.js
* Creating an HTTP server with Express
* Handling GET and POST requests
* Communicating between browser and server
* Running external programs with `child_process.spawn()`
* Working with asynchronous JavaScript (`async/await`)
* Understanding Promises and the Event Loop
* Sending and receiving JSON
* Downloading files dynamically
* Managing files with the Node.js File System (`fs`)
* Building a complete client-server application

---

# 🏗️ Project Architecture

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ Browser (Frontend)  │
│ HTML • CSS • JS     │
└─────────┬───────────┘
          │ HTTP Request
          ▼
┌─────────────────────┐
│ Express Server      │
│ Node.js Backend     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ yt-dlp.exe          │
│ Downloads Video     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Downloads Folder    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Browser Downloads   │
└─────────────────────┘
```

---

# 🔄 Download Lifecycle

```text
User opens website
        │
        ▼
GET /
        │
        ▼
Server returns HTML
        │
        ▼
User pastes YouTube URL
        │
        ▼
POST /download/video
        │
        ▼
Express receives request
        │
        ▼
yt-dlp is started
        │
        ▼
Video downloads
        │
        ▼
Server responds with filename
        │
        ▼
Browser requests file
        │
        ▼
res.download()
        │
        ▼
Video saved to user's computer
```

---

# Core Concepts 

## Node.js

JavaScript running outside the browser with access to the operating system.

---

## Express

A lightweight web framework used to create servers and API routes.

---

## HTTP

The communication protocol between the browser and the server.

### GET

Retrieve information.

```
GET /
GET /file/video.mp4
```

### POST

Send data to the server.

```
POST /download/video
```

---

## Request & Response

Every request creates two objects:

```
req
```

Contains data sent by the browser.

```
res
```

Used to send data back to the browser.

---

## JSON

The standard format used for exchanging data.

Example:

```json
{
  "url": "https://youtube.com/..."
}
```

---

## Async / Await

Allows JavaScript to perform long-running tasks without freezing the application.

---

## Promises

Represents work that will complete in the future.

States:

* Pending
* Fulfilled
* Rejected

---

## Event Loop

Node.js processes thousands of requests efficiently by handling asynchronous operations through its event-driven architecture.

---

## Spawned Processes

The project launches `yt-dlp.exe` using:

```javascript
spawn(...)
```

This creates an external operating system process that performs the download independently from the Node.js server.

---

## File System

The built-in `fs` module is used to:

* Create folders
* Store downloaded videos
* Manage files
* Serve downloads back to the browser

---

# Technologies Used

* Node.js
* Express.js
* JavaScript (ES6+)
* HTML
* CSS
* Fetch API
* yt-dlp
* File System (`fs`)
* Child Processes (`spawn`)
* HTTP
* JSON

---

#  Learning Outcome

This project introduced many of the core concepts used in modern backend development.

Understanding this application provides a strong foundation for building:

* REST APIs
* Discord Bots
* Telegram Bots
* Dashboards
* SaaS Applications
* AI Backends
* Authentication Systems
* File Upload Services
* Full-Stack Web Applications

complete Node.js project
