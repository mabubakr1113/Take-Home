import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

const PRODUCTS_QUERY = gql`
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
`;

function StatusPill({ status }) {
  const styles = {
    Healthy: "bg-green-100 text-green-700",
    Low: "bg-yellow-100 text-yellow-700",
    Critical: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ProductsTable({ filter, page, setPage, onRowClick }) {
  const { data, loading, error } = useQuery(PRODUCTS_QUERY, {
    variables: { filter: { ...filter, offset: (page - 1) * 10, limit: 10 } },
  });
  const items = data?.products.items ?? [];
  const total = data?.products.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total]);

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Product", "SKU", "Warehouse", "Stock", "Demand", "Status"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                Loading…
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-red-600">
                Failed to load
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            items.map((row) => {
              const isCritical = row.status === "Critical";
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className={`${
                    isCritical ? "bg-red-50" : ""
                  } hover:bg-gray-50 cursor-pointer`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.warehouse}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.stock}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.demand}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <StatusPill status={row.status} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-md border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
