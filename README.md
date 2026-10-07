# University Research Opportunity Portal

A web application for managing research opportunities: REST API (Node.js + Express), MySQL database, and a simple HTML/CSS/JavaScript frontend.

**GitHub Repository:** https://github.com/username/research-opportunity-portal

## Project Structure

```
backend/    Node.js + Express REST API
frontend/   HTML, CSS, JavaScript frontend (served by the backend)
database/   schema.sql (MySQL setup)
postman/    Exported Postman collection
```

## Requirements

- Node.js (v18 or later)
- MySQL Server

## Setup and Run

1. **Create the database and table**

   ```
   mysql -u root -p < database/schema.sql
   ```
   (Or open `database/schema.sql` in MySQL Workbench and run it.)

2. **Configure the backend**

   ```
   cd backend
   cp .env.example .env
   ```
   Open `.env` and set your own MySQL username and password (`DB_USER`, `DB_PASSWORD`). Do not commit `.env`.

3. **Install dependencies and start the server**

   ```
   npm install
   npm start
   ```

4. **Open the application**

   Go to http://localhost:3000 in your browser. The backend serves the frontend.

## API Endpoints

| Method | Endpoint                  | Description                    | Success |
|--------|---------------------------|--------------------------------|---------|
| POST   | /api/opportunities        | Create an opportunity          | 201     |
| GET    | /api/opportunities        | Get all opportunities          | 200     |
| GET    | /api/opportunities/:id    | Get one opportunity            | 200     |
| PUT    | /api/opportunities/:id    | Update an opportunity          | 200     |
| DELETE | /api/opportunities/:id    | Delete an opportunity          | 200     |

Error codes: 400 (invalid/missing data or invalid ID), 404 (not found), 500 (server error).

## Opportunity Fields

`id`, `title`, `description`, `research_area`, `faculty_name`, `department`, `required_skills`, `available_positions`, `application_deadline` (YYYY-MM-DD), `status` (Open / Closed).

## Testing with Postman

Import `postman/Research_Portal.postman_collection.json` into Postman and run the requests in order (the server must be running on port 3000).
