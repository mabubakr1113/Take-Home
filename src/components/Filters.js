import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const WAREHOUSES_QUERY = gql`
  query Warehouses {
    warehouses
  }
`;

export default function Filters({
  query,
  setQuery,
  warehouse,
  setWarehouse,
  status,
  setStatus,
}) {
  const { data } = useQuery(WAREHOUSES_QUERY);
  const warehouses = data?.warehouses ?? [];
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, SKU, ID"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={warehouse}
        onChange={(e) => setWarehouse(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Warehouses</option>
        {warehouses.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option>All</option>
        <option>Healthy</option>
        <option>Low</option>
        <option>Critical</option>
      </select>
    </div>
  );
}
