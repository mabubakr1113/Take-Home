import { products as seedProducts } from "./mockData.mjs";

let products = seedProducts.map((p) => ({ ...p }));

function computeStatus(stock, demand) {
  if (stock > demand) return "Healthy";
  if (stock === demand) return "Low";
  return "Critical";
}

function applyStatus(product) {
  return { ...product, status: computeStatus(product.stock, product.demand) };
}

function filterByStatus(items, status) {
  if (!status || status === "All") return items;
  return items.filter((p) => computeStatus(p.stock, p.demand) === status);
}

export const resolvers = {
  Query: {
    products: (_root, { filter }) => {
      const q = filter?.query?.toLowerCase() ?? "";
      const wh = filter?.warehouse ?? "";
      const status = filter?.status ?? "";
      const offset = filter?.offset ?? 0;
      const limit = filter?.limit ?? 10;

      let result = products.filter(
        (p) =>
          (!q ||
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q)) &&
          (!wh || p.warehouse === wh)
      );
      result = filterByStatus(result, status);
      const total = result.length;
      const items = result.slice(offset, offset + limit).map(applyStatus);
      return { items, total };
    },
    warehouses: () => Array.from(new Set(products.map((p) => p.warehouse))),
    kpis: (_root, { range }) => {
      const totalStock = products.reduce((s, p) => s + p.stock, 0);
      const totalDemand = products.reduce((s, p) => s + p.demand, 0);
      const fillRate =
        totalDemand === 0
          ? 0
          : (products.reduce((s, p) => s + Math.min(p.stock, p.demand), 0) /
              totalDemand) *
            100;
      const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;
      const trend = Array.from({ length: days }).map((_, i) => {
        const day = `${i + 1}`;
        const stock = Math.max(0, totalStock + Math.round(Math.sin(i) * 10));
        const demand = Math.max(0, totalDemand + Math.round(Math.cos(i) * 10));
        return { day, stock, demand };
      });
      return { totalStock, totalDemand, fillRate, trend };
    },
    product: (_root, { id }) => applyStatus(products.find((p) => p.id === id)),
  },
  Mutation: {
    updateDemand: (_root, { id, demand }) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      products[idx].demand = demand;
      return applyStatus(products[idx]);
    },
    transferStock: (_root, { id, delta }) => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      products[idx].stock = Math.max(0, products[idx].stock + delta);
      return applyStatus(products[idx]);
    },
  },
};
