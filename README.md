# Commodities Management System - Local Setup Instructions

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download from mongodb.com](https://www.mongodb.com/try/download/community)
- **Git** (optional, for cloning) - [Download from git-scm.com](https://git-scm.com/)

## Project Structure

```
commodities-project/
├── commodities-frontend/    # React frontend
└── commodities-backend/     # Node.js backend
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd commodities-backend
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/commodities-management

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long-and-complex
JWT_EXPIRE=7d

# CORS Origins
CLIENT_URL=http://localhost:5173
```

### 4. Start MongoDB Service

**For Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

**For macOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or run directly
mongod --config /usr/local/etc/mongod.conf
```

**For Linux:**
```bash
# Using systemd
sudo systemctl start mongod

# Or run directly
sudo mongod --dbpath /var/lib/mongo
```

### 5. Seed the Database (Optional)
```bash
node utils/seedData.js
```

This creates sample users and products:
- **Manager**: `manager@example.com` / `Password@123`
- **Store Keeper**: `keeper@example.com` / `Password@123`

### 6. Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

You should see:
```
MongoDB Connected: 127.0.0.1
Server running in development mode on port 5000
```

## Frontend Setup

### 1. Open New Terminal and Navigate to Frontend Directory
```bash
cd commodities-frontend
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Create Environment File (Optional)
Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Accessing the Application

### 1. Open Your Browser
Navigate to: **http://localhost:5173**

### 2. Test Login Credentials

**Manager Account:**
- Email: `manager@example.com`
- Password: `Password@123`
- Access: Dashboard + Products Management

**Store Keeper Account:**
- Email: `keeper@example.com`
- Password: `Password@123`
- Access: Products Management Only

### 3. Test Registration
Navigate to: **http://localhost:5173/register**
- Create new accounts with different roles
- All fields are required
- Password must be at least 6 characters

## Quick Start Commands

### Complete Setup in One Go

**Terminal 1 (Backend):**
```bash
cd commodities-backend
npm install
node utils/seedData.js
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd commodities-frontend
npm install
npm run dev
```

### Alternative: Using Package Scripts

You can also use these individual commands:

**Backend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
node utils/seedData.js
```

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Available API Endpoints

Once the backend is running, you can test these endpoints:

- **Health Check**: `GET http://localhost:5000/api/health`
- **User Login**: `POST http://localhost:5000/api/auth/login`
- **User Registration**: `POST http://localhost:5000/api/auth/register`
- **Get Products**: `GET http://localhost:5000/api/products`
- **Dashboard Stats**: `GET http://localhost:5000/api/products/stats/dashboard`

## Features Available

### Manager Dashboard
- View total products, views, earnings, and stock
- Top performing products analytics
- Category distribution charts
- Quick action buttons

### Products Management
- View all products with search and filtering
- Add new products via modal forms
- Edit existing products
- Stock status indicators
- Role-based access control

### Authentication
- Secure JWT-based authentication
- Role-based route protection
- Light/dark mode toggle
- Responsive design

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Ensure MongoDB is running
mongod --version
# Check if service is active
brew services list | grep mongodb  # macOS
```

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env file
PORT=5001
```

**CORS Errors:**
- Ensure `CLIENT_URL=http://localhost:5173` in backend `.env`
- Check that both servers are running on correct ports

**Dependency Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Build

### Frontend Production Build
```bash
cd commodities-frontend
npm run build
npm run preview
```

### Backend Production Mode
```bash
cd commodities-backend
NODE_ENV=production npm start
```

## Development Tips

- **Hot Reload**: Both servers support hot reload for development
- **API Testing**: Use tools like Postman or Thunder Client for API testing
- **Database GUI**: Use MongoDB Compass to view database contents
- **Browser DevTools**: Use React Developer Tools extension for debugging

The application should now be fully functional with authentication, role-based access, product management, and dashboard analytics!
