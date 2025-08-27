export const products = [
  {
    id: "P-1001",
    name: "12mm Hex Bolt",
    sku: "HEX-12-100",
    warehouse: "BLR-A",
    stock: 180,
    demand: 120,
  },
  {
    id: "P-1002",
    name: "Steel Washer",
    sku: "WSR-08-500",
    warehouse: "BLR-A",
    stock: 50,
    demand: 80,
  },
  {
    id: "P-1003",
    name: "M8 Nut",
    sku: "NUT-08-200",
    warehouse: "PNQ-C",
    stock: 80,
    demand: 80,
  },
  {
    id: "P-1004",
    name: "Bearing 608ZZ",
    sku: "BRG-608-50",
    warehouse: "DEL-B",
    stock: 24,
    demand: 120,
  },
];

export const getWarehouses = () => {
  return Array.from(new Set(products.map((p) => p.warehouse)));
};
