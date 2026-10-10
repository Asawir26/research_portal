# University Research Opportunity Portal

A web application for managing research opportunities: REST API (Node.js + Express), MySQL/MariaDB database, and a simple HTML/CSS/JavaScript frontend.

**GitHub Repository:** https://github.com/Asawir26/research_portal

## Project Structure

```
backend/    Node.js + Express REST API
frontend/   HTML, CSS, JavaScript frontend (served by the backend)
database/   schema.sql (MySQL/MariaDB setup)
postman/    Exported Postman collection
```

## Requirements

- Node.js (v18 or later)
- MySQL or MariaDB Server

## Setup and Run

1. **Create a database user** (if you don't already have one), by logging into MySQL/MariaDB as an admin and running:

   ```sql
   CREATE USER 'student'@'localhost' IDENTIFIED BY 'student123';
   GRANT ALL PRIVILEGES ON *.* TO 'student'@'localhost' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```

2. **Create the database and table**

   ```
   mysql -u student -p < database/schema.sql
   ```
   (Or open `database/schema.sql` in MySQL Workbench / a MySQL client and run it.)

3. **Install backend dependencies**

   ```
   cd backend
   npm install
   ```

4. **Start the server**

   ```
   node server.js
   ```
   The database credentials (`user: 'student'`, `password: 'student123'`) are set directly in `server.js`. Update them there if your local username/password are different.

5. **Open the application**

   Go to http://localhost:3000 in your browser. The backend serves the frontend as well.

## API Endpoints

| Method | Endpoint                  | Description                    | Success |
|--------|---------------------------|--------------------------------|---------|
| POST   | /api/opportunities        | Create an opportunity          | 201     |
| GET    | /api/opportunities        | Get all opportunities          | 200     |
| GET    | /api/opportunities/:id    | Get one opportunity            | 200     |
| PUT    | /api/opportunities/:id    | Update an opportunity          | 200     |
| DELETE | /api/opportunities/:id    | Delete an opportunity          | 200     |

Error codes: 400 (invalid/missing data), 404 (not found), 500 (server error).

## Opportunity Fields

`id`, `title`, `description`, `research_area`, `faculty_name`, `department`, `required_skills`, `available_positions`, `application_deadline` (YYYY-MM-DD), `status` (Open / Closed).

## Testing with Postman

Import `postman/Research_Portal.postman_collection.json` into Postman and run the requests in order (the server must be running on `http://localhost:3000`). The collection covers creating opportunities, retrieving all and one by ID, updating, changing status, deleting, a 404 on a deleted ID, and a 400 on invalid input.

## Demonstration Video

See `demo.mp4` included in this submission / repository.
or click the link below :
**Demo video google drive link:** https://drive.google.com/file/d/11MX7ExaJ3yUjRprFsfWEX7MCuWFfCcLQ/view?usp=sharing
