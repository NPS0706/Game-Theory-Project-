# Sports Booking System

This is a full-stack web application for managing sports bookings across multiple cities in India. It's designed for sports center operations managers to handle bookings efficiently.

## Features

- City and sport selection
- Calendar-based booking view
- Booking creation with conflict prevention
- Responsive design for desktop and mobile
- Error handling and user feedback

## Technologies Used

- Frontend: Next.js, React, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes
- Database: MongoDB
- Deployment: Vercel

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sports-booking-system.git
   cd sports-booking-system
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

1. If you're using MongoDB Atlas, create a new cluster and obtain the connection string.
2. If you're using a local MongoDB installation, make sure it's running and use the appropriate connection string.
3. The application will automatically create the necessary collections when you start using it.

### Deployment

This application is set up to be easily deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository.
2. Log in to your Vercel account and click "New Project".
3. Import your GitHub repository.
4. In the "Environment Variables" section, add your `MONGODB_URI`.
5. Click "Deploy" and wait for the deployment to complete.

Deployed application link: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

## API Endpoints

- GET /api/bookings
  - Query parameters: city, sport, date
  - Returns a list of bookings for the specified city, sport, and date

- POST /api/bookings
  - Body: { city, sport, date, court, startTime }
  - Creates a new booking

## Assumptions and Limitations

- The current implementation assumes a fixed 1-hour duration for all bookings.
-   There's no authentication system in place; it's assumed that only authorized personnel have access to the application.
- The application doesn't handle different time zones; all times are assumed to be in the local time of the sports center.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
```

This README provides comprehensive instructions for setting up the project locally, connecting to the database, deploying the application, and understanding its features and limitations.