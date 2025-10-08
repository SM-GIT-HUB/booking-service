# Booking Service

A **dedicated microservice** to handle booking operations for the Airplane Booking System. It offers RESTful APIs for creating bookings, processing payments, canceling bookings, and automatically cleaning up stale bookings via scheduled tasks.

> **Main takeaway:** This service implements transactional booking workflows with seat availability checks, dummy payment validation, and periodic cancellation of expired pending bookings.

***

## Table of Contents

- [Overview](#overview)  
- [Architecture](#architecture)  
- [Tech Stack](#tech-stack)  
- [Domain Model](#domain-model)  
- [API Endpoints](#api-endpoints)  
- [Booking Workflow](#booking-workflow)  
- [Setup & Run](#setup--run)  
- [Development Scripts](#development-scripts)  
- [Project Structure](#project-structure)  
- [Logging & Cron Jobs](#logging--cron-jobs)  
- [Roadmap](#roadmap)  
- [License & Author](#license--author)  

***

## Overview

- **Purpose:** Manage booking lifecycle including creation, payment, cancellation, and cleanup.  
- **Entry Point:** `src/server.js` loads Express routes, configuration, and cron jobs.  
- **Database:** MySQL via Sequelize ORM.  

***

## Architecture

- Express app with a single `/api` route group  
- Layered design:

  **Routes → Controllers → Services → Repositories → Models → Database**

- Transactions ensure atomic operations across external flight-service calls and local booking records  
- Scheduled tasks (Node-Cron) to cancel expired bookings older than 5 minutes  

***

## Tech Stack

- **Node.js** (CommonJS modules)  
- **Express 5**  
- **Sequelize ORM (v6) + sequelize-cli**  
- **MySQL2**  
- **dotenv**  
- **node-cron** for scheduled tasks  
- **axios** for inter-service HTTP calls  
- **http-status-codes** for standardized responses  
- **Winston** for logging  

***

## Domain Model

- **Booking**:  
  - `flightId`, `userId`  
  - `status`: ENUM [INITIATED, PENDING, BOOKED, CANCELLED]  
  - `totalCost`, `numberOfSeats`  

***

## API Endpoints

_Base URL: `/api`_

- `POST /booking`  
  - Create a new booking; checks seat availability via flight-service; uses DB transaction.  

- `POST /booking/payment`  
  - Process payment; validates booking status, cost, and time window; marks status as BOOKED.  

***

## Booking Workflow

1. **Create Booking** (`createBooking`)  
   - Fetch flight details from Flight Service  
   - Validate seat availability  
   - Calculate `totalCost`  
   - Create booking record in DB  
   - Deduct seats via flight-service PATCH  
   - Commit transaction  

2. **Make Payment** (`makePayment`)  
   - Verify booking not already paid or cancelled  
   - Validate `totalCost` and `userId`  
   - Check payment window (5 min)  
   - Update status to BOOKED  

3. **Cancel Booking** (`cancelBooking`)  
   - Mark status CANCELLED  
   - Increment seats via flight-service PATCH  

4. **Cron Cleanup** (`cancelOldBookings`)  
   - Runs every 5 minutes  
   - Cancels bookings older than 5 minutes with non-terminal status  
   - Returns count of cancelled records  

***

## Setup & Run

1. **Clone & Install**

```bash
git clone https://github.com/SM-GIT-HUB/booking-service.git
cd booking-service
npm install
```

2. **Environment**

Create a `.env` in root:

```
PORT=4000
FLIGHT_SERVICE_URL=http://localhost:3000
```

3. **Initialize Sequelize**

```bash
npx sequelize init
```

Configure `config/config.json` for your DB credentials.

4. **Migrate & Seed (if any)**

```bash
npx sequelize db:migrate
```

5. **Run Service**

```bash
npm run dev
```

Service listens on `PORT` and starts cron jobs on launch.

***

## Development Scripts

- **dev**: `node --watch src/server.js` — Restarts on file changes

***

## Project Structure

```
booking-service/
├── package.json
├── package-lock.json
├── .gitignore
└── src/
    ├── config/            # ServerConfig and logger
    ├── controllers/       # booking-controller.js
    ├── models/            # booking model
    ├── repositories/      # BookingRepository
    ├── routes/            # route definitions
    ├── services/          # BookingService, CrudService
    ├── utils/             # cron-jobs, helpers, common responses
    └── server.js          # Express app entry
```

***

## Logging & Cron Jobs

- **Winston** configured in `src/config` for structured logs  
- **Cron Jobs** defined in `src/utils/cron-jobs.js`, scheduled every 5 minutes to cancel stale bookings  

***

## Roadmap

- Add booking history retrieval  
- Implement idempotency for payment calls  
- Secure endpoints with authentication (JWT)  
- Enhance observability with health checks and metrics  
- Introduce retry logic for inter-service calls  

***

## License & Author

- **License:** ISC  
- **Author:** Soumik  

***