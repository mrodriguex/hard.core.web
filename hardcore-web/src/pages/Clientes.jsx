import { useState, useEffect, useCallback } from "react";
import * as clienteService from "../services/clienteService";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const emptyForm = {
  id: 0,
  nombre: "",
  abreviatura: "",
  descripcion: "",
  rfc: "",
  razonSocial: "",
  idClientePadre: "",
  orden: 0,
  activo: true,
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [filterActivo, setFilterActivo] = useState(undefined);

  // Add / Edit modal
  const [modal, setModal] = useState({ open: false, mode: "add", data: { ...emptyForm } });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────
  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await clienteService.getAll({
        activo: filterActivo,
        pageIndex,
        pageSize,
      });

      if (Array.isArray(result)) {
        setClientes(result);
        setTotal(result.length);
      } else if (result?.items) {
        setClientes(result.items);
        setTotal(result.total ?? result.items.length);
      } else {
        setClientes([]);
        setTotal(0);
      }
    } catch (e) {
      setError(e.message || "Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, filterActivo]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setModal({ open: true, mode: "add", data: { ...emptyForm } });
    setModalError("");
  }

  function openEdit(cliente) {
    setModal({
      open: true,
      mode: "edit",
      data: { ...cliente, idClientePadre: cliente.idClientePadre ?? "" },
    });
    setModalError("");
  }

  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setModal((m) => ({
      ...m,
      data: {
        ...m.data,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? value === "" ? "" : Number(value)
            : value,
      },
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setModalError("");
    setSaving(true);
    try {
      const payload = {
        ...modal.data,
        idClientePadre: modal.data.idClientePadre === "" ? null : Number(modal.data.idClientePadre),
      };
      if (modal.mode === "add") {
        await clienteService.add(payload);
      } else {
        await clienteService.update(payload);
      }
      closeModal();
      loadClientes();
    } catch (e) {
      setModalError(e.message || "Error al guardar el cliente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete helpers ────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await clienteService.remove(deleteTarget.id);
      setDeleteTarget(null);
      if (clientes.length === 1 && pageIndex > 1) setPageIndex((p) => p - 1);
      else loadClientes();
    } catch (e) {
      setError(e.message || "Error al eliminar el cliente.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors text-sm"
        >
          + Nuevo Cliente
        </button>

        <select
          value={filterActivo === undefined ? "" : String(filterActivo)}
          onChange={(e) => {
            setFilterActivo(e.target.value === "" ? undefined : e.target.value === "true");
            setPageIndex(1);
          }}
          className="border border-gray-300 rounded p-2 text-sm bg-white"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(1); }}
          className="border border-gray-300 rounded p-2 text-sm bg-white"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} por página</option>
          ))}
        </select>

        <button
          onClick={loadClientes}
          disabled={loading}
          className="ml-auto border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded text-sm transition-colors"
        >
          ↻ Actualizar
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold ml-4">×</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Nombre", "Abreviatura", "RFC", "Razón Social", "Cliente Padre", "Orden", "Estatus", "Acciones"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400">
                  <span className="inline-block animate-pulse">Cargando...</span>
                </td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400">
                  Sin registros
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{c.abreviatura}</td>
                  <td className="px-4 py-3 text-gray-600">{c.rfc}</td>
                  <td className="px-4 py-3 text-gray-600">{c.razonSocial}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.idClientePadre ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.orden}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      c.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-blue-600 hover:text-blue-800 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: c.id, nombre: c.nombre })}
                        className="text-red-600 hover:text-red-800 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>{total} registro{total !== 1 ? "s" : ""} en total</span>
          <div className="flex gap-2 items-center">
            <button
              disabled={pageIndex === 1}
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ← Anterior
            </button>
            <span className="px-2">Página {pageIndex} de {totalPages}</span>
            <button
              disabled={pageIndex >= totalPages}
              onClick={() => setPageIndex((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">
                {modal.mode === "add" ? "Nuevo Cliente" : "Editar Cliente"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {modalError && (
                <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {modalError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nombre"
                    required
                    value={modal.data.nombre}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abreviatura</label>
                  <input
                    name="abreviatura"
                    value={modal.data.abreviatura ?? ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                  <input
                    name="rfc"
                    value={modal.data.rfc ?? ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                  <input
                    name="razonSocial"
                    value={modal.data.razonSocial ?? ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Padre (ID)</label>
                  <input
                    name="idClientePadre"
                    type="number"
                    min={0}
                    value={modal.data.idClientePadre ?? ""}
                    onChange={handleFormChange}
                    placeholder="Vacío = raíz"
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    name="orden"
                    type="number"
                    min={0}
                    value={modal.data.orden ?? 0}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 mt-5 col-span-2">
                  <input
                    id="cliente-activo-check"
                    name="activo"
                    type="checkbox"
                    checked={modal.data.activo ?? true}
                    onChange={handleFormChange}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label htmlFor="cliente-activo-check" className="text-sm font-medium text-gray-700">
                    Activo
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={modal.data.descripcion ?? ""}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded text-sm font-semibold transition-colors"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Confirmar eliminación</h2>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el cliente{" "}
              <strong>{deleteTarget.nombre || `#${deleteTarget.id}`}</strong>?{" "}
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded text-sm font-semibold transition-colors"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
