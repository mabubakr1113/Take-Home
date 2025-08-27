import { gql } from "graphql-tag";

export const typeDefs = gql`
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
`;
