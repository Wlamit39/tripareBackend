# Hotel Rate Comparator Backend

This project is a backend service for comparing hotel rates using multiple suppliers. It leverages [Temporal](https://temporal.io/) for orchestrating workflows and [Express.js](https://expressjs.com/) for the HTTP API.

## Features

- **Express.js API**: Provides endpoints to search for hotels and interact with supplier services.
- **Temporal Workflows**: Orchestrates calls to multiple hotel suppliers, handles retries, and returns the best rate.
- **Supplier Integration**: Modular supplier endpoints for easy extension.
- **Diagnostics**: Returns detailed diagnostics for each supplier call.

---

## Project Structure

```
src/
  index.ts                # Express app entry point
  routes/
    searchHotels.ts       # Main hotel search API route (uses Temporal)
  suppliers/
    supplierA.ts          # Supplier A mock/service
    supplierB.ts          # Supplier B mock/service
  workflows/
    hotelSearch.workflow.ts # Temporal workflow definition
    activities.ts           # Activities for supplier calls
  workers/
    worker.ts             # Temporal worker entry point
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- [Temporal Server](https://docs.temporal.io/server/quick-install) running locally (default settings)
- Yarn or npm

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3100
TEST_MODE=false
```

- `PORT`: Port for the Express server (default: 3100)
- `TEST_MODE`: If `true`, enables mock/test suppliers

---

## Running the Project

### 1. Start the Temporal Worker

This process runs the workflow and activities.

```bash
npm run worker
# or
yarn worker
```

### 2. Start the Express Server

In a separate terminal:

```bash
npm run dev
# or
yarn dev
```

The server will be available at [http://localhost:3100](http://localhost:3100).

---

## API Endpoints

### `POST /api/search-hotels`

Search for hotels using all suppliers via a Temporal workflow.

**Request Body:**

```json
{
  "city": "London",
  "checkIn": "2024-07-01",
  "checkOut": "2024-07-05"
}
```

**Response:**

```json
{
  "result": {
    "hotelId": "string",
    "name": "string",
    "price": 123
  },
  "diagnostics": {
    "supplierA": "success",
    "supplierB": "success"
  }
}
```

---

## How It Works

- The Express route `/api/search-hotels` triggers a Temporal workflow (`hotelSearchWorkflow`).
- The workflow calls both suppliers in parallel using activities (`fetchFromSupplierA`, `fetchFromSupplierB`).
- Each activity fetches hotel data from its respective supplier endpoint.
- The workflow aggregates results, selects the cheapest hotel, and returns diagnostics for each supplier.
- Temporal handles retries and error handling for transient failures.

---

## Scripts

- `npm run dev` — Start Express server with hot reload (nodemon)
- `npm run worker` — Start Temporal worker
- `npm run test` — Run tests

---

## Dependencies

- `express` — Web framework
- `temporalio` — Temporal SDK for Node.js
- `axios` — HTTP client for supplier calls
- `dotenv` — Environment variable management
- `cors` — CORS middleware

---

## Development & Testing

- Suppliers are modular; add new suppliers in the `suppliers/` directory and update the workflow/activities as needed.
- Use `TEST_MODE=true` in `.env` to enable mock/test suppliers for local development.
- Tests can be added in the `__tests__/` directory.

---

## License

MIT
