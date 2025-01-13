# Railway Management System (IRCTC)

This project is a railway management system similar to IRCTC. It provides a backend API for users and admins to manage and book train seats efficiently, with features like concurrency handling, secure authentication, and role-based access control.

---

## Features

### User Features
1. **Register and Login:** Users can securely register and log in.
2. **Train Availability:** Search for trains between two stations.
3. **Book Seats:** Book available seats on a train with robust concurrency handling.
4. **View Bookings:** Retrieve all bookings made by the user.
5. **View Specific Bookings:** Retrive specific bookings made by the user.

### Admin Features
1. **Register and Login:** Admins can register and log in.
2. **API Key Protection:** All admin endpoints are secured with a unique API key.
3. **Manage Trains:** Admins can add, update, or delete trains.

### Technical Highlights
- **Concurrency Handling:** Prevents race conditions during seat booking using transactions and row-level locking.
- **Role-Based Access Control:** Differentiates functionality for users and admins.
- **Secure Authentication:** Uses JWT for session management and API keys for admin endpoint protection.

---

## Tech Stack

- **Backend:** Node.js with Express
- **Database:** MySQL using Sequelize ORM
- **Authentication:** JWT and API key-based authentication
- **Environment Management:** dotenv
- **Concurrency Handling:** MySQL transactions with row-level locking

---

## Installation

### Prerequisites
- Node.js installed
- MySQL server running
- npm or yarn installed

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Devang2304/IRCTC-Booking-api.git
   cd IRCTC-Booking-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
    DB_HOST='localhost'
    DB_USER='root'
    DB_PASSWORD='mySQLDt7iu$%Dev'
    DB_NAME='irctc'
    DB_PORT=5000
    JWT_SECRET='secret'
    DB_DIALECT='mysql'
   ```

4. Start the MySQL server and create the database:
   ```sql
   CREATE DATABASE irctc;
   ```

5. Start the server:
   ```bash
   node server.js
   ```

---

## API Documentation

### **User Endpoints**

#### **1. Register User**
- **URL:** `POST /api/user/register`
- **Description:** Registers a new user.
- **Payload:**
  ```json
  {
    "username": "Devang",
    "password": "xyz",
    "email": "devang@gmail.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "user_id": 1,
      "username": "Devang",
      "email": "devang@gmail.com",
      "role": "user"
    }
  }
  ```

#### **2. Login User**
- **URL:** `POST /api/user/login`
- **Description:** Logs in a user and returns a JWT token.
- **Payload:**
  ```json
  {
    "username": "Devang",
    "password": "xyz"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```

#### **3. Train Availability**
- **URL:** `GET /api/user/trains`
- **Description:** Fetches trains between source and destination stations.
- **Query Parameters:**
  ```
  ?source_station=Mumbai&destination_station=Delhi
  ```
- **Response:**
  ```json
  {
    "trains": [
      {
        "train_id": 1,
        "train_name": "Rajdhani Express",
        "source_station": "Mumbai",
        "destination_station": "Delhi",
        "total_seats": 100,
        "available_seats": 80
      }
    ]
  }
  ```

#### **4. Book a Seat**
- **URL:** `POST /api/user/book`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer JWT_TOKEN"
  }
  ```
- **Payload:**
  ```json
  {
    "train_id": 1,
    "seats_booked": 2
  }
  ```
- **Response:**
  ```json
  {
    "message": "Booking successful",
    "booking": {
      "booking_id": 1,
      "user_id": 1,
      "train_id": 1,
      "seats_booked": 2,
      "booking_status": "confirmed"
    }
  }
  ```

#### **5. Get Booking Details**
- **URL:** `GET /api/user/bookings`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer JWT_TOKEN"
  }
  ```
- **Response:**
  ```json
  {
    "bookings": [
      {
        "booking_id": 1,
        "train_id": 1,
        "seats_booked": 2,
        "booking_status": "confirmed",
        "Train": {
          "train_name": "Rajdhani Express",
          "source_station": "Mumbai",
          "destination_station": "Delhi"
        }
      }
    ]
  }
  ```


### 6. Get Specific Booking Details
**URL:** `GET /api/user/bookings/:booking_id`  
**Headers:**
```json
{
  "Authorization": "Bearer JWT_TOKEN"
}
```

**Response:**
```json
{
  "booking": {
    "booking_id": 1,
    "user_id": 1,
    "train_id": 1,
    "seats_booked": 2,
    "booking_status": "confirmed",
    "Train": {
      "train_name": "Rajdhani Express",
      "source_station": "Mumbai",
      "destination_station": "Delhi"
    }
  }
}
``` 

---

### **Admin Endpoints**

#### **1. Register Admin**
- **URL:** `POST /api/admin/register`
- **Payload:**
  ```json
  {
    "username": "admin",
    "password": "admin",
    "email": "admin@gmail.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Admin registered successfully",
    "apiKey": "admin-API_KEY"
  }
  ```

#### **2. Login Admin**
- **URL:** `POST /api/admin/login`
- **Payload:**
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```

#### **3. Add Train**
- **URL:** `POST /api/admin/trains`
- **Headers:**
  ```json
  {
    "x-api-key": "admin-API_KEY"
  }
  ```
- **Payload:**
  ```json
  {
    "train_name": "Rajdhani Express",
    "source_station": "Mumbai",
    "destination_station": "Delhi",
    "total_seats": 100
  }
  ```
- **Response:**
  ```json
  {
    "message": "Train added successfully"
  }
  ```

---



