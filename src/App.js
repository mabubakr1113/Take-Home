import "./App.css";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import Filters from "./components/Filters";
import ProductsTable from "./components/ProductsTable";
import Drawer from "./components/Drawer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const KPIS_QUERY = gql`
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
`;

function TopBar({ range, setRange }) {
  const chips = ["7d", "14d", "30d"];
  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-2xl font-semibold">SupplySight</div>
      <div className="flex gap-2">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setRange(c)}
            className={`px-3 py-1 rounded-full border ${
              range === c
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function KpiCards({ kpis, loading, error }) {
  const fmt = (n) => new Intl.NumberFormat().format(Math.round(n));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">Total Stock</div>
        <div className="text-2xl font-semibold">
          {loading ? "—" : error ? "!" : fmt(kpis.totalStock)}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">Total Demand</div>
        <div className="text-2xl font-semibold">
          {loading ? "—" : error ? "!" : fmt(kpis.totalDemand)}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">Fill Rate</div>
        <div className="text-2xl font-semibold">
          {loading ? "—" : error ? "!" : `${(kpis.fillRate || 0).toFixed(0)}%`}
        </div>
      </div>
    </div>
  );
}

function TrendChart({ trend }) {
  return (
    <div className="rounded-lg border bg-white p-4 h-72">
      <div className="text-sm text-gray-600 mb-2">Stock vs Demand</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trend}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function App() {
  const [range, setRange] = useState("7d");
  const [query, setQuery] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, loading, error } = useQuery(KPIS_QUERY, {
    variables: { range },
  });
  const kpis = data?.kpis ?? {
    totalStock: 0,
    totalDemand: 0,
    fillRate: 0,
    trend: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <TopBar range={range} setRange={setRange} />
        <KpiCards kpis={kpis} loading={loading} error={!!error} />
        <div className="mt-4">
          <TrendChart trend={kpis.trend} />
        </div>
        <Filters
          query={query}
          setQuery={(v) => {
            setPage(1);
            setQuery(v);
          }}
          warehouse={warehouse}
          setWarehouse={(v) => {
            setPage(1);
            setWarehouse(v);
          }}
          status={status}
          setStatus={(v) => {
            setPage(1);
            setStatus(v);
          }}
        />
        <ProductsTable
          filter={{ query, warehouse, status }}
          page={page}
          setPage={setPage}
          onRowClick={(row) => setSelected(row)}
        />
      </div>
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        product={selected}
        onUpdated={() => {
          setSelected(null);
        }}
      />
    </div>
  );
}

export default App;
