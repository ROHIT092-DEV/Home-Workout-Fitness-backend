# Home-Workout-Fitness-backend

## Project Description

This is the backend for the Home Workout Fitness application. It provides APIs for user authentication, role-based access control, and other functionalities to support the application.

## Features

- User authentication (login, signup, token generation)
- Role-based access control
- Logging for errors and combined logs
- Modular structure for scalability

## Project Structure

```
backend/
├── config/         # Configuration files (e.g., database, logger)
├── controller/     # Controllers for handling business logic
├── logs/           # Log files
├── middleware/     # Middleware for authentication and roles
├── model/          # Database models
├── routes/         # API routes
├── utils/          # Utility functions (e.g., token generation)
├── server.js       # Entry point of the application
├── package.json    # Project dependencies and scripts
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ROHIT092-DEV/Home-Workout-Fitness-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Home-Workout-Fitness-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:3000` by default.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
