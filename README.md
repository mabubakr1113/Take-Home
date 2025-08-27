SupplySight Dashboard — Take‑Home Frontend Challenge

Overview

- Daily Inventory Dashboard with KPIs, trend chart, filters, paginated products table, and a details drawer.
- Mock GraphQL API (in‑memory) with queries, filters, and mutations.

Quick Start

1. Install dependencies

```
npm install
```

2. Run the app (starts server and client)

```
npm start
```

- Client: http://localhost:3001
- GraphQL server (Apollo standalone): http://localhost:4000/

Useful Scripts

- Dev (both): `npm start`
- Client only: `npm run client`
- Server only: `npm run server`
- Production build: `npm run build`

## Features

- KPI cards: Total Stock, Total Demand, Fill Rate
- Trend chart: Stock vs Demand over selected range (7d/14d/30d)
- Filters: search by name/SKU/ID, warehouse dropdown, status (All/Healthy/Low/Critical)
- Products table: Product, SKU, Warehouse, Stock, Demand, Status
  - Status pill and row tint:
    - Healthy: stock > demand
    - Low: stock = demand
    - Critical: stock < demand (row lightly red-tinted)
- Pagination: 10 rows per page
- Drawer: product details, Update Demand and Transfer Stock mutations
- Loading and error states for all data requests

## Business Logic

- Fill Rate = (sum(min(stock, demand)) / sum(demand)) × 100%
- Status rules drive the status pill color and Critical row tint

## GraphQL API

Schema (simplified):

```graphql
type Product {
  id: ID!
  name: String!
  sku: String!
  warehouse: String!
  stock: Int!
  demand: Int!
  status: String!
}

type KPI {
  totalStock: Int!
  totalDemand: Int!
  fillRate: Float!
  trend: [TrendPoint!]!
}

type TrendPoint {
  day: String!
  stock: Int!
  demand: Int!
}

input ProductsFilter {
  query: String
  warehouse: String
  status: String
  offset: Int = 0
  limit: Int = 10
}

type ProductsPage {
  items: [Product!]!
  total: Int!
}

type Query {
  products(filter: ProductsFilter): ProductsPage!
  warehouses: [String!]!
  kpis(range: String!): KPI!
  product(id: ID!): Product
}

type Mutation {
  updateDemand(id: ID!, demand: Int!): Product!
  transferStock(id: ID!, delta: Int!): Product!
}
```

Example operations:

```graphql
# Products with filters + pagination
query Products($filter: ProductsFilter) {
  products(filter: $filter) {
    total
    items {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
}

# KPI trend over range
query Kpis($range: String!) {
  kpis(range: $range) {
    totalStock
    totalDemand
    fillRate
    trend {
      day
      stock
      demand
    }
  }
}

# Warehouses dropdown
query Warehouses {
  warehouses
}

# Mutations
mutation UpdateDemand($id: ID!, $demand: Int!) {
  updateDemand(id: $id, demand: $demand) {
    id
    stock
    demand
    status
  }
}

mutation TransferStock($id: ID!, $delta: Int!) {
  transferStock(id: $id, delta: $delta) {
    id
    stock
    demand
    status
  }
}
```

## Project Structure (key files)

- `src/server/index.mjs`: Apollo Server (standalone) entry
- `src/server/schema.mjs`: GraphQL schema
- `src/server/resolvers.mjs`: Query/Mutation resolvers
- `src/server/mockData.mjs`: Seed data
- `src/apolloClient.js`: Apollo Client configuration
- `src/components/*`: Filters, ProductsTable, Drawer
- `src/App.js`: Dashboard layout and KPI/trend

## Tech & Notes

- React (CRA) + Apollo Client + Recharts + Tailwind CSS (v3)
- Tailwind: configured via `tailwind.config.js` and `postcss.config.js`; CSS is in `src/index.css` using `@tailwind` directives
- Mock data is in-memory; state resets on server restart

## Troubleshooting

- Port in use: change client port in `package.json` script `client` (e.g., `set PORT=3002 && react-scripts start`) or free the port
- Tailwind PostCSS error: ensure dev deps are `tailwindcss@^3`, `postcss@^8`, `autoprefixer@^10` and `postcss.config.js` uses `tailwindcss` and `autoprefixer`
- Network errors from client: confirm API at `http://localhost:4000/` is running

## Notes & Improvements

See `NOTES.md` for design decisions, trade-offs, and ideas to extend this.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about running tests for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
