import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
      stock
      status
    }
  }
`;
const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $delta: Int!) {
    transferStock(id: $id, delta: $delta) {
      id
      demand
      stock
      status
    }
  }
`;

export default function Drawer({ open, onClose, product, onUpdated }) {
  const commonOptions = {
    onCompleted: onUpdated,
    refetchQueries: ["Products", "Kpis"],
  };
  const [updateDemand, { loading: updatingDemand }] = useMutation(
    UPDATE_DEMAND,
    commonOptions
  );
  const [transferStock, { loading: transferring }] = useMutation(
    TRANSFER_STOCK,
    commonOptions
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-4 border-b">
                      <Dialog.Title className="text-lg font-semibold">
                        Product Details
                      </Dialog.Title>
                    </div>
                    {product ? (
                      <div className="p-4 space-y-4">
                        <div>
                          <div className="text-sm text-gray-500">ID</div>
                          <div className="text-sm font-medium">
                            {product.id}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="text-sm font-medium">
                            {product.name}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">SKU</div>
                            <div className="text-sm font-medium">
                              {product.sku}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Warehouse
                            </div>
                            <div className="text-sm font-medium">
                              {product.warehouse}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Stock</div>
                            <div className="text-sm font-medium">
                              {product.stock}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Demand</div>
                            <div className="text-sm font-medium">
                              {product.demand}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="text-sm font-medium mb-2">
                            Update Demand
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const demand = parseInt(
                                e.target.demand.value,
                                10
                              );
                              if (!Number.isFinite(demand)) return;
                              updateDemand({
                                variables: { id: product.id, demand },
                              });
                            }}
                            className="space-y-2"
                          >
                            <input
                              name="demand"
                              type="number"
                              min="0"
                              defaultValue={product.demand}
                              className="w-full rounded-md border px-3 py-2"
                            />
                            <button
                              disabled={updatingDemand}
                              className="w-full rounded-md bg-blue-600 text-white px-3 py-2"
                            >
                              {updatingDemand ? "Updating…" : "Update"}
                            </button>
                          </form>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="text-sm font-medium mb-2">
                            Transfer Stock
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const delta = parseInt(e.target.delta.value, 10);
                              if (!Number.isFinite(delta)) return;
                              transferStock({
                                variables: { id: product.id, delta },
                              });
                              e.target.reset();
                            }}
                            className="space-y-2"
                          >
                            <input
                              name="delta"
                              type="number"
                              className="w-full rounded-md border px-3 py-2"
                              placeholder="e.g. +20 or -10"
                            />
                            <button
                              disabled={transferring}
                              className="w-full rounded-md bg-emerald-600 text-white px-3 py-2"
                            >
                              {transferring ? "Transferring…" : "Transfer"}
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-600">
                        No product selected.
                      </div>
                    )}
                    <div className="mt-auto p-4 border-t">
                      <button
                        onClick={onClose}
                        className="w-full rounded-md border px-3 py-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
