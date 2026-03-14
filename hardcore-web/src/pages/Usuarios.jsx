import { useState, useEffect, useCallback } from "react";
import * as usuarioService from "../services/usuarioService";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const emptyForm = {
  id: 0,
  nombre: "",
  abreviatura: "",
  descripcion: "",
  nombreUsuario: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  correo: "",
  contrasena: "",
  numeroEmpleado: 0,
  orden: 0,
  activo: true,
  estatus: true,
  bloqueado: false,
  cambioContrasena: false,
  idUsuarioPorAusencia: "",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
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

  // Detail drawer
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Change password modal
  const [pwdModal, setPwdModal] = useState({ open: false, username: "", password: "", confirm: "", saving: false, error: "" });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────────
  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await usuarioService.getAll({ activo: filterActivo, pageIndex, pageSize });
      if (Array.isArray(result)) {
        setUsuarios(result);
        setTotal(result.length);
      } else if (result?.items) {
        setUsuarios(result.items);
        setTotal(result.total ?? result.items.length);
      } else {
        setUsuarios([]);
        setTotal(0);
      }
    } catch (e) {
      setError(e.message || "Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, filterActivo]);

  useEffect(() => { loadUsuarios(); }, [loadUsuarios]);

  // ── Detail drawer ─────────────────────────────────────────────────────────
  async function openDetail(u) {
    setDetail({ ...u });
    setDetailLoading(true);
    try {
      const full = await usuarioService.getById(u.id);
      setDetail(full);
    } catch { /* fall back to list data */ }
    finally { setDetailLoading(false); }
  }

  // ── Unlock ────────────────────────────────────────────────────────────────
  async function handleUnlock(u) {
    try {
      await usuarioService.unlockUser(u.id);
      loadUsuarios();
      if (detail?.id === u.id) setDetail((d) => ({ ...d, bloqueado: false, numeroIntentos: 0 }));
    } catch (e) {
      setError(e.message || "Error al desbloquear usuario.");
    }
  }

  // ── Add / Edit modal ──────────────────────────────────────────────────────
  function openAdd() {
    setModal({ open: true, mode: "add", data: { ...emptyForm } });
    setModalError("");
  }

  function openEdit(u) {
    setModal({
      open: true, mode: "edit",
      data: {
        ...u,
        contrasena: "",
        idUsuarioPorAusencia: u.idUsuarioPorAusencia ?? "",
      },
    });
    setModalError("");
  }

  function closeModal() { setModal((m) => ({ ...m, open: false })); }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setModal((m) => ({
      ...m,
      data: {
        ...m.data,
        [name]: type === "checkbox" ? checked
          : type === "number" ? (value === "" ? "" : Number(value))
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
        idUsuarioPorAusencia: modal.data.idUsuarioPorAusencia === "" ? null : Number(modal.data.idUsuarioPorAusencia),
      };
      if (!payload.contrasena) delete payload.contrasena; // skip empty password on edit
      if (modal.mode === "add") {
        await usuarioService.add(payload);
      } else {
        await usuarioService.update(payload);
      }
      closeModal();
      loadUsuarios();
    } catch (e) {
      setModalError(e.message || "Error al guardar el usuario.");
    } finally {
      setSaving(false);
    }
  }

  // ── Change password modal ─────────────────────────────────────────────────
  function openPwdModal(u) {
    setPwdModal({ open: true, username: u.nombreUsuario ?? u.claveUsuario ?? "", password: "", confirm: "", saving: false, error: "" });
  }

  async function handlePwdSave(e) {
    e.preventDefault();
    if (pwdModal.password !== pwdModal.confirm) {
      setPwdModal((m) => ({ ...m, error: "Las contraseñas no coinciden." }));
      return;
    }
    setPwdModal((m) => ({ ...m, saving: true, error: "" }));
    try {
      await usuarioService.updatePassword(pwdModal.username, pwdModal.password);
      setPwdModal((m) => ({ ...m, open: false }));
    } catch (e) {
      setPwdModal((m) => ({ ...m, saving: false, error: e.message || "Error al cambiar contraseña." }));
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usuarioService.remove(deleteTarget.id);
      setDeleteTarget(null);
      if (usuarios.length === 1 && pageIndex > 1) setPageIndex((p) => p - 1);
      else loadUsuarios();
    } catch (e) {
      setError(e.message || "Error al eliminar el usuario.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-2 sm:gap-3 items-center mb-5">
        <button onClick={openAdd} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors text-sm">
          + Nuevo Usuario
        </button>

        <select
          value={filterActivo === undefined ? "" : String(filterActivo)}
          onChange={(e) => { setFilterActivo(e.target.value === "" ? undefined : e.target.value === "true"); setPageIndex(1); }}
          className="w-full sm:w-auto border border-gray-300 rounded p-2 text-sm bg-white"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(1); }}
          className="w-full sm:w-auto border border-gray-300 rounded p-2 text-sm bg-white"
        >
          {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} por página</option>)}
        </select>

        <button onClick={loadUsuarios} disabled={loading} className="w-full sm:w-auto sm:ml-auto border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded text-sm transition-colors">
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
              {["ID", "Nombre Completo", "Usuario", "Correo", "Nº Emp.", "Perfiles", "Bloqueado", "Estatus", "Acciones"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400"><span className="animate-pulse">Cargando...</span></td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400">Sin registros</td></tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{u.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.nombreCompleto || `${u.nombre ?? ""}`}</div>
                    <div className="text-xs text-gray-400">{u.apellidoPaterno} {u.apellidoMaterno}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{u.nombreUsuario ?? u.claveUsuario}</td>
                  <td className="px-4 py-3 text-gray-600">{u.correo}</td>
                  <td className="px-4 py-3 text-gray-600 text-center">{u.numeroEmpleado || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {u.perfiles?.length > 0
                      ? <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">{u.perfiles.length}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.bloqueado
                      ? <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">Bloqueado</span>
                      : <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Libre</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => openDetail(u)} className="text-gray-600 hover:text-gray-800 text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition-colors">Ver</button>
                      <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-xs border border-blue-300 px-2 py-1 rounded hover:bg-blue-50 transition-colors">Editar</button>
                      <button onClick={() => openPwdModal(u)} className="text-amber-600 hover:text-amber-800 text-xs border border-amber-300 px-2 py-1 rounded hover:bg-amber-50 transition-colors">Clave</button>
                      {u.bloqueado && (
                        <button onClick={() => handleUnlock(u)} className="text-green-600 hover:text-green-800 text-xs border border-green-300 px-2 py-1 rounded hover:bg-green-50 transition-colors">Desbloquear</button>
                      )}
                      <button onClick={() => setDeleteTarget({ id: u.id, nombre: u.nombreCompleto || u.nombre })} className="text-red-600 hover:text-red-800 text-xs border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition-colors">Eliminar</button>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm text-gray-600">
          <span>{total} registro{total !== 1 ? "s" : ""} en total</span>
          <div className="flex gap-2 items-center flex-wrap">
            <button disabled={pageIndex === 1} onClick={() => setPageIndex((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors">← Anterior</button>
            <span className="px-2">Página {pageIndex} de {totalPages}</span>
            <button disabled={pageIndex >= totalPages} onClick={() => setPageIndex((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors">Siguiente →</button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold">Detalle de Usuario</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
            </div>

            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 animate-pulse">Cargando...</div>
            ) : (
              <div className="p-6 space-y-6 text-sm">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  {detail.fotografia ? (
                    <img src={detail.fotografia} alt="foto" className="w-16 h-16 rounded-full object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold select-none">
                      {(detail.nombre ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg">{detail.nombreCompleto || detail.nombre}</p>
                    <p className="text-gray-400 font-mono">{detail.nombreUsuario ?? detail.claveUsuario}</p>
                    <p className="text-gray-500">{detail.correo}</p>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${detail.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{detail.activo ? "Activo" : "Inactivo"}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${detail.bloqueado ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{detail.bloqueado ? "Bloqueado" : "Sin bloqueo"}</span>
                  {detail.cambioContrasena && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Cambio de clave requerido</span>}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ["ID", detail.id],
                    ["Nº Empleado", detail.numeroEmpleado || "—"],
                    ["Apellido Paterno", detail.apellidoPaterno || "—"],
                    ["Apellido Materno", detail.apellidoMaterno || "—"],
                    ["Abreviatura", detail.abreviatura || "—"],
                    ["Orden", detail.orden],
                    ["Intentos fallidos", detail.numeroIntentos ?? 0],
                    ["ID Sustituto", detail.idUsuarioPorAusencia ?? "—"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="font-medium">{val}</p>
                    </div>
                  ))}
                  {detail.descripcion && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Descripción</p>
                      <p>{detail.descripcion}</p>
                    </div>
                  )}
                </div>

                {/* Perfiles */}
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Perfiles ({detail.perfiles?.length ?? 0})</p>
                  {detail.perfiles?.length > 0 ? (
                    <ul className="space-y-1">
                      {detail.perfiles.map((p) => (
                        <li key={p.id} className="bg-purple-50 rounded px-3 py-2 font-medium text-purple-800">{p.nombre} <span className="text-purple-400 font-normal text-xs ml-1">({p.abreviatura})</span></li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400">Sin perfiles asignados.</p>}
                </div>

                {/* Empresas */}
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Empresas ({detail.empresas?.length ?? 0})</p>
                  {detail.empresas?.length > 0 ? (
                    <ul className="space-y-1">
                      {detail.empresas.map((e) => (
                        <li key={e.id} className="bg-blue-50 rounded px-3 py-2 font-medium text-blue-800">{e.nombre} <span className="text-blue-400 font-normal text-xs ml-1">({e.abreviatura})</span></li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400">Sin empresas asignadas.</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  <button onClick={() => { setDetail(null); openEdit(detail); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition-colors">Editar</button>
                  <button onClick={() => { openPwdModal(detail); setDetail(null); }} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded text-sm font-semibold transition-colors">Cambiar Clave</button>
                  {detail.bloqueado && (
                    <button onClick={() => handleUnlock(detail)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition-colors">Desbloquear</button>
                  )}
                  <button onClick={() => setDetail(null)} className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded text-sm transition-colors">Cerrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold">{modal.mode === "add" ? "Nuevo Usuario" : "Editar Usuario"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {modalError && <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{modalError}</div>}

              {/* Name section */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Datos personales</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
                    <input name="nombre" required value={modal.data.nombre} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abreviatura</label>
                    <input name="abreviatura" value={modal.data.abreviatura ?? ""} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                    <input name="apellidoPaterno" value={modal.data.apellidoPaterno ?? ""} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                    <input name="apellidoMaterno" value={modal.data.apellidoMaterno ?? ""} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input name="correo" type="email" value={modal.data.correo ?? ""} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº Empleado</label>
                    <input name="numeroEmpleado" type="number" min={0} value={modal.data.numeroEmpleado ?? 0} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Account section */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Cuenta</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario <span className="text-red-500">*</span></label>
                    <input name="nombreUsuario" required value={modal.data.nombreUsuario ?? ""} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña {modal.mode === "add" && <span className="text-red-500">*</span>}
                      {modal.mode === "edit" && <span className="text-gray-400 font-normal">(vacío = sin cambio)</span>}
                    </label>
                    <input name="contrasena" type="password" required={modal.mode === "add"} value={modal.data.contrasena ?? ""} onChange={handleFormChange} autoComplete="new-password" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                    <input name="orden" type="number" min={0} value={modal.data.orden ?? 0} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Usuario por Ausencia</label>
                    <input name="idUsuarioPorAusencia" type="number" min={0} value={modal.data.idUsuarioPorAusencia ?? ""} onChange={handleFormChange} placeholder="Vacío = ninguno" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-6 mt-4">
                  {[
                    { name: "activo", label: "Activo" },
                    { name: "estatus", label: "Estatus" },
                    { name: "bloqueado", label: "Bloqueado" },
                    { name: "cambioContrasena", label: "Forzar cambio de clave" },
                  ].map(({ name, label }) => (
                    <div key={name} className="flex items-center gap-2">
                      <input id={`flag-${name}`} name={name} type="checkbox" checked={modal.data[name] ?? false} onChange={handleFormChange} className="w-4 h-4 accent-blue-600" />
                      <label htmlFor={`flag-${name}`} className="text-sm font-medium text-gray-700">{label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="descripcion" value={modal.data.descripcion ?? ""} onChange={handleFormChange} rows={2} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded text-sm font-semibold transition-colors">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {pwdModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Cambiar Contraseña</h2>
              <button onClick={() => setPwdModal((m) => ({ ...m, open: false }))} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
            </div>
            <form onSubmit={handlePwdSave} className="p-6 space-y-4">
              {pwdModal.error && <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{pwdModal.error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input value={pwdModal.username} readOnly className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm font-mono text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña <span className="text-red-500">*</span></label>
                <input type="password" required autoComplete="new-password" value={pwdModal.password} onChange={(e) => setPwdModal((m) => ({ ...m, password: e.target.value }))} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña <span className="text-red-500">*</span></label>
                <input type="password" required value={pwdModal.confirm} onChange={(e) => setPwdModal((m) => ({ ...m, confirm: e.target.value }))} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPwdModal((m) => ({ ...m, open: false }))} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={pwdModal.saving} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded text-sm font-semibold transition-colors">
                  {pwdModal.saving ? "Guardando..." : "Cambiar Clave"}
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
              ¿Estás seguro de que deseas eliminar al usuario <strong>{deleteTarget.nombre || `#${deleteTarget.id}`}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">Cancelar</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded text-sm font-semibold transition-colors">
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
