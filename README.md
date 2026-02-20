# Postman Clone 🚀

A modern, minimal, and visually appealing API client built with **FastAPI** and **React**. This application allows you to test RESTful APIs with a sleek, dark-themed interface, bypassing CORS restrictions via a backend proxy.

![UI Preview](https://via.placeholder.com/800x450.png?text=Postman+Clone+UI+Preview) *Placeholder for UI Screenshot*

## ✨ Features

- **Modern Dark UI**: A high-contrast "Deep Black & Indigo" theme with smooth edges and subtle animations.
- **Request Proxying**: Routes all requests through the FastAPI backend to avoid browser CORS limitations.
- **Method Support**: Supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- **Dynamic Headers & Body**: Easily toggle between editing request headers and the body using a tabbed interface.
- **Pretty Response**: Automatically detects and formats JSON responses with syntax highlighting style.
- **Status Indicators**: Visual status badges (e.g., 200 OK, 404 Not Found) for immediate feedback.
- **Responsive Layout**: Side-by-side request/response panes for an efficient workflow.

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Vite** (Build Tool)
- **Lucide React** (Icons)
- **Vanilla CSS** (Custom modern styling)

### Backend
- **FastAPI** (Python)
- **HTTPX** (Async HTTP Client)
- **Uvicorn** (ASGI Server)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (3.9 or higher)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```
The backend will start on **`http://localhost:8001`**.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at **`http://localhost:5173`**.

## 📂 Project Structure

```text
postman-clone/
├── backend/
│   ├── main.py             # FastAPI proxy server logic
│   ├── requirements.txt    # Python dependencies
│   └── backend_log.txt     # Server logs
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main application logic
│   │   ├── App.css         # Modern Indigo theme styles
│   │   └── main.tsx        # React entry point
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # You are here!
```

## 📝 Usage

1.  Open `http://localhost:5173` in your browser.
2.  Select the **HTTP Method** (GET, POST, etc.).
3.  Enter the **URL** you wish to test.
4.  (Optional) Click the **Headers** tab to add JSON-formatted headers.
5.  (Optional) Click the **Body** tab to add a request payload.
6.  Click **SEND** and view the formatted response in the right pane.

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
