# P-Cineplex - MERN Movie Ticket Booking

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack movie ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js). It features a user-friendly interface for browsing movies and booking seats, and an admin panel for managing site content.

## Live Demo

-   **Frontend:** [https://pcineplex-movie-ticket-booking.vercel.app/](https://pcineplex-movie-ticket-booking.vercel.app/)
-   **Backend:** [https://pcineplex-server.vercel.app/](https://pcineplex-server.vercel.app/)

## Features

-   **User Authentication:** Secure user sign-up and sign-in using Clerk.
-   **Movie Listings:** Browse "Now Showing" and "Coming Soon" movies.
-   **Movie Details:** View detailed information for each movie, including cast, synopsis, and trailers.
-   **Interactive Seat Selection:** A dynamic seat layout for choosing seats in a cinema hall.
-   **Booking & Payments:** Seamless booking process with payment handling via Stripe.
-   **Booking History:** Users can view their past and upcoming bookings.
-   **Admin Dashboard:** A comprehensive dashboard for administrators to manage:
    -   Movies and Showtimes
    -   Cinemas and Screens
    -   Promotional Banners
    -   Homepage Carousel Slides
    -   View all user bookings.

## Tech Stack

| Category      | Technology                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------- |
| **Frontend**  | React, React Router, Vite, Tailwind CSS, Axios, Chart.js, Swiper                                       |
| **Backend**   | Node.js, Express.js, Mongoose                                                                          |
| **Database**  | MongoDB                                                                                                |
| **Auth**      | Clerk                                                                                                  |
| **Payments**  | Stripe                                                                                                 |
| **File Storage**| Cloudinary                                                                                             |
| **Deployment**| Vercel                                                                                                 |

## Architecture

The project follows a standard client-server architecture:

-   **Client (Frontend):** A single-page application (SPA) built with React. It handles the user interface and interacts with the backend via RESTful API calls.
-   **Server (Backend):** A Node.js and Express.js application that exposes a REST API. It handles business logic, database interactions, and communication with external services like Stripe and Clerk.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (A local instance or a cloud-hosted one like MongoDB Atlas)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/zinmyoswe/MERN-Movie-Ticket-Booking.git
cd MERN-Movie-Ticket-Booking
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory
touch .env
```

Add the following environment variables to your `.env` file. See the [Environment Variables](#environment-variables) section for details on how to get these keys.

```env
# MongoDB Connection
MONGODB_URI=<Your_MongoDB_Connection_String>

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=<Your_Clerk_Publishable_Key>
CLERK_SECRET_KEY=<Your_Clerk_Secret_Key>

# Inngest
INNGEST_EVENT_KEY=<Your_INNGEST_EVENT_KEY>
INNGEST_SIGNING_KEY=<Your_INNGEST_SIGNING_KEY>

#TMDB
TMDB_API_KEY=<Your_TMDB_API_Key>


# Stripe
STRIPE_PUBLISHABLE_KEY=<Your_Stripe_Publishable_Key>
STRIPE_SECRET_KEY=<Your_Stripe_Secret_Key>
STRIPE_WEBHOOK_SECRET=<Your_Stripe_Webhook_Secret>

# Nodemailer
SENDER_EMAIL=<Your_Sender_Email>
SMTP_USER=<Your_SMTP_User>
SMTP_PASSWORD=<Your_SMTP_Password>

```

### 3. Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env.local file in the /client directory
touch .env.local
```

Add the following environment variables to your `.env.local` file:

```env
# URL of the backend server
VITE_SERVER_URL=http://localhost:3000

# Clerk Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=<Your_Clerk_Publishable_Key>

VITE_CURRENCY = '$'

VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original

VITE_TINYMCE_API_KEY=<Your_TinyMCE_API_Key>


```

### 4. Running the Application

1.  **Start the Backend Server:**
    Open a terminal in the `/server` directory and run:
    ```bash
    npm run server
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the Frontend Application:**
    Open another terminal in the `/client` directory and run:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Environment Variables

-   `MONGODB_URI`: Your MongoDB connection string.
-   `CLERK_SECRET_KEY`: Found on the Clerk dashboard under API Keys.
-   `VITE_CLERK_PUBLISHABLE_KEY`: Found on the Clerk dashboard under API Keys.
-   `STRIPE_SECRET_KEY`: Found on the Stripe dashboard for developers.
-   `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhook events.
-   `CLOUDINARY_*`: Credentials for your Cloudinary account for image and media uploads.

## API Endpoints

The backend exposes the following RESTful API endpoints:

-   `GET /api/show`: Fetch shows and movie details.
-   `POST /api/booking`: Create a new booking.
-   `GET /api/booking`: Get user's booking history.
-   `POST /api/stripe/webhooks`: Handle events from Stripe.
-   `GET /api/cinema`: Fetch cinema details.
-   `GET /api/slide`: Fetch slides for the homepage carousel.
-   `GET /api/promotion`: Fetch promotions.
-   `/api/admin/*`: Routes for administrative actions (requires admin privileges).

## Project Structure

The repository is a monorepo with two main folders:

-   **/client**: Contains the React frontend application.
    -   `src/pages`: Main page components.
    -   `src/components`: Reusable UI components.
    -   `src/context`: React context for state management.
    -   `src/lib`: Utility functions.
-   **/server**: Contains the Node.js/Express backend.
    -   `configs`: Database and other service configurations.
    -   `controllers`: Logic for handling requests.
    -   `models`: Mongoose schemas for the database.
    -   `routes`: API route definitions.
    -   `middleware`: Custom middleware (e.g., authentication).

## Deployment

The application is deployed on Vercel. The `vercel.json` files in both the `client` and `server` directories contain the necessary configuration for deployment, including serverless function rewrites.
