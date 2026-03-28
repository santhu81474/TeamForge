# TeamForge - Skill Collaboration Network

TeamForge is a professional platform designed to facilitate skill-based collaboration, project management, and developer growth. It leverages discrete mathematics and optimized algorithms to match developers with projects that suit their expertise.

## 🚀 Core Features

- **Skill Testing & Grading**: Take standardized tests to verify your proficiency in various technologies (e.g., React, Node.js).
- **Intelligent Skill Matching**: Discrete Mathematics-based intersection logic to match user skills with project requirements.
- **Dynamic Leaderboards**: Ranking system using efficient sorting algorithms (O(n log n) Merge Sort) based on ratings and project completion.
- **Project Lifecycle Management**: Create, join, and manage collaborative projects with ease.
- **Secure Authentication**: Robust JWT-based authentication system.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, Vanilla CSS (Premium Dark Mode Aesthetic)
- **Backend**: Node.js, Express, MongoDB
- **Tools**: Concurrent Server execution, ESLint

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TeamForge
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd backend && npm install
   cd ..
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add `MONGO_URI` and `JWT_SECRET`.

### Running the Application

Run both frontend and backend concurrently:
```bash
npm run dev
```

## 📐 Mathematical Concepts Applied

- **Set Theory**: Used for skill matching (Intersection of User Skills ∩ Project Requirements).
- **Complexity Theory**: Implementation of O(n log n) sorting for leaderboards.
- **Algorithmic Efficiency**: Optimized data structures for quick retrieval.

---
Built with ❤️ for the Developer Community.
