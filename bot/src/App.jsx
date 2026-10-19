import React, { useState, useEffect, useMemo } from 'react';
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  XMarkIcon, 
  ArrowUturnLeftIcon, 
  CircleStackIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Credencial fija requerida
const ACCESS_PASSWORD = "ADMIN_27";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [activeTab, setActiveTab] = useState("bancos"); // bancos, estadisticas, facturas, notas_credito, gastos_bancarios
  
  // Modales
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Estados de Bancos
  const [selectedBank, setSelectedBank] = useState("Bancolombia");
  const [bankBalances, setBankBalances] = useState({
    "Bancolombia": { cuenta: "Cta Corriente #8912", saldo: 145820400, actualizado: "Hoy, 10:45 AM" },
    "Davivienda": { cuenta: "Cta Ahorros #3321", saldo: 84310200, actualizado: "Hoy, 09:30 AM" },
    "Banco de Bogotá": { cuenta: "Cta Corriente #1104", saldo: 32450000, actualizado: "Hoy, 08:15 AM" },
    "BBVA": { cuenta: "Cta Ahorros #9023", saldo: 18720000, actualizado: "Ayer, 05:00 PM" }
  });

  // Movimientos bancarios
  const [movimientos, setMovimientos] = useState([
    { id: 1, banco: "Bancolombia", fecha: "2026-10-19", descripcion: "Pago Proveedor DIAN Fac-902", valor: 4500000, tipo: "credito" },
    { id: 2, banco: "Bancolombia", fecha: "2026-10-19", descripcion: "Recaudo Clientes PSE", valor: 12800000, tipo: "debito" },
    { id: 3, banco: "Davivienda", fecha: "2026-10-18", descripcion: "Comisión Remesa Exterior", valor: 350000, tipo: "credito" },
    { id: 4, banco: "Banco de Bogotá", fecha: "2026-10-18", descripcion: "Consignación Efectivo", valor: 5200000, tipo: "debito" },
  ]);

  // Filtros de movimientos
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroNaturaleza, setFiltroNaturaleza] = useState("todos"); // todos, debito, credito

  // Facturas AX1 & Notificaciones
  const [facturasAX1] = useState([
    { id: "FE-2041", tercero: "LOGÍSTICA AERONÁUTICA SAS", valor: 14200000, estado: "verde", siigo: "Causada" },
    { id: "FE-2042", tercero: "COMBUSTIBLES DEL VALLE", valor: 8900000, estado: "amarillo", siigo: "Tercero Nuevo" },
    { id: "FE-2043", tercero: "REPUESTOS Y MOTORES LTDA", valor: 3100000, estado: "verde", siigo: "Causada" },
    { id: "FE-2044", tercero: "SERVICIOS AEROPORTUARIOS", valor: 2450000, estado: "rojo", siigo: "Error Token DIAN" }
  ]);

  // Saludo dinámico según hora
  const saludoHorario = useMemo(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días, Equipo Finanzas Ágilex";
    if (hora >= 12 && hora < 19) return "Buenas tardes, Equipo Finanzas Ágilex";
    return "Buenas noches, Equipo Finanzas Ágilex";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passInput === ACCESS_PASSWORD) {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  // Filtrado reactivo de movimientos
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(m => {
      if (m.banco !== selectedBank) return false;
      if (filtroFecha && m.fecha !== filtroFecha) return false;
      if (filtroNaturaleza !== "todos" && m.tipo !== filtroNaturaleza) return false;
      if (filtroBusqueda) {
        const query = filtroBusqueda.toLowerCase();
        const coincideDesc = m.descripcion.toLowerCase().includes(query);
        const coincideVal = m.valor.toString().includes(query);
        if (!coincideDesc && !coincideVal) return false;
      }
      return true;
    });
  }, [movimientos, selectedBank, filtroFecha, filtroNaturaleza, filtroBusqueda]);

  // Pantalla de Login de seguridad
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#131c2e] border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-400/10 flex items-center justify-center border border-yellow-400/30">
            <span className="text-3xl font-black text-yellow-400 tracking-wider">AX</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Portal Contable Ágilex</h2>
          <p className="text-sm text-gray-400 mb-6">Automatización de Facturación, Bancos y Siigo</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Ingrese clave de acceso"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#0b0f19] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            {passError && <p className="text-red-400 text-xs font-semibold">Clave incorrecta. Intente de nuevo.</p>}
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold rounded-xl transition shadow-lg shadow-yellow-400/20"
            >
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-200 flex flex-col font-sans">
      {/* ENCABEZADO */}
      <header className="h-20 bg-[#0e1626] border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-6">
          {/* Logo ÁGILEX */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("bancos")}>
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-indigo-400">ÁGILE</span>
              <span className="text-yellow-400">X</span>
            </div>
            <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-400/20 font-semibold">
              BOT FANTASMA ACTIVO
            </span>
          </div>
          <div className="hidden md:block h-6 w-px bg-gray-800" />
          <p className="hidden md:block text-sm text-gray-300 font-medium">{saludoHorario}</p>
        </div>

        {/* Controles de la derecha */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
            className="p-2.5 rounded-xl bg-[#141e33] border border-gray-800 text-gray-300 hover:text-yellow-400 relative transition"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-[#141e33]" />
          </button>

          {/* Ajustes */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-[#141e33] border border-gray-800 text-gray-300 hover:text-yellow-400 transition"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* Botón interactivo circular sello ÁGILEX que redirige al inicio */}
          <button
            onClick={() => setActiveTab("bancos")}
            title="Ir al inicio"
            className="w-11 h-11 rounded-full bg-yellow-400 hover:scale-105 active:scale-95 transition flex items-center justify-center p-0.5 shadow-md shadow-yellow-400/20 border-2 border-yellow-500 overflow-hidden"
          >
            <div className="w-full h-full rounded-full bg-yellow-300 flex flex-col items-center justify-center text-[8px] font-black text-indigo-950 leading-none">
              <span>AGILEX</span>
              <span className="text-[6px] opacity-75">✈</span>
            </div>
          </button>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        {/* BARRA LATERAL VERTICAL */}
        <aside className="w-20 bg-[#0c1322] border-r border-gray-800 flex flex-col items-center py-6 space-y-6">
          <button
            onClick={() => setActiveTab("bancos")}
            title="Bancos"
            className={`p-3.5 rounded-2xl transition ${
              activeTab === "bancos" 
                ? "bg-yellow-400 text-gray-950 font-bold shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:bg-[#141f36] hover:text-white"
            }`}
          >
            <BanknotesIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab("estadisticas")}
            title="Estadísticas Financieras"
            className={`p-3.5 rounded-2xl transition ${
              activeTab === "estadisticas" 
                ? "bg-yellow-400 text-gray-950 font-bold shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:bg-[#141f36] hover:text-white"
            }`}
          >
            <ChartBarIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab("facturas")}
            title="Facturas AX1"
            className={`p-3.5 rounded-2xl transition ${
              activeTab === "facturas" 
                ? "bg-yellow-400 text-gray-950 font-bold shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:bg-[#141f36] hover:text-white"
            }`}
          >
            <span className="text-xl font-black leading-none">X</span>
          </button>

          <button
            onClick={() => setActiveTab("notas_credito")}
            title="Notas Crédito"
            className={`p-3.5 rounded-2xl transition ${
              activeTab === "notas_credito" 
                ? "bg-yellow-400 text-gray-950 font-bold shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:bg-[#141f36] hover:text-white"
            }`}
          >
            <ArrowUturnLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab("gastos_bancarios")}
            title="Gastos Bancarios"
            className={`p-3.5 rounded-2xl transition ${
              activeTab === "gastos_bancarios" 
                ? "bg-yellow-400 text-gray-950 font-bold shadow-lg shadow-yellow-400/20" 
                : "text-gray-400 hover:bg-[#141f36] hover:text-white"
            }`}
          >
            <CircleStackIcon className="w-6 h-6" />
          </button>
        </aside>

        {/* ÁREA DE CONTENIDO */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* TAB 1: BANCOS */}
          {activeTab === "bancos" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-white">Consolidado y Movimientos Bancarios</h1>
                <p className="text-sm text-gray-400">Actualizado mediante carga de archivo plano y bot de extracción</p>
              </div>

              {/* Recuadro de saldos totalizados por cada banco */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(bankBalances).map(([nombre, datos]) => (
                  <div
                    key={nombre}
                    onClick={() => setSelectedBank(nombre)}
                    className={`p-5 rounded-2xl border cursor-pointer transition ${
                      selectedBank === nombre 
                        ? "bg-[#14233d] border-yellow-400 ring-2 ring-yellow-400/20" 
                        : "bg-[#0f1728] border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{nombre}</span>
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-mono">Activo</span>
                    </div>
                    <p className="text-xl font-bold text-white mb-1">${datos.saldo.toLocaleString('es-CO')}</p>
                    <p className="text-xs text-gray-500">{datos.cuenta}</p>
                  </div>
                ))}
              </div>

              {/* Recuadro sobre movimientos: Banco seleccionado + actualización */}
              <div className="p-6 bg-[#0f1728] border border-gray-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs text-yellow-400 font-semibold uppercase">Banco en foco</span>
                  <h2 className="text-xl font-bold text-white">{selectedBank} — {bankBalances[selectedBank]?.cuenta}</h2>
                  <p className="text-xs text-gray-400">Última actualización de saldo: {bankBalances[selectedBank]?.actualizado}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2 bg-[#172338] border border-gray-700 hover:border-yellow-400 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center space-x-2 transition">
                    <ArrowUpTrayIcon className="w-4 h-4 text-yellow-400" />
                    <span>Subir Movimientos del Día</span>
                    <input type="file" className="hidden" onChange={() => alert("Movimientos cargados y procesados correctamente.")} />
                  </label>
                </div>
              </div>

              {/* Filtros de movimientos */}
              <div className="bg-[#0f1728] border border-gray-800 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filtro por fecha */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Filtrar por Fecha</label>
                    <input
                      type="date"
                      value={filtroFecha}
                      onChange={(e) => setFiltroFecha(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090d16] border border-gray-700 rounded-xl text-white text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Búsqueda por valor o concepto */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Buscar por Valor o Concepto</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej: 4500000 o Proveedor"
                        value={filtroBusqueda}
                        onChange={(e) => setFiltroBusqueda(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#090d16] border border-gray-700 rounded-xl text-white text-xs focus:outline-none focus:border-yellow-400"
                      />
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Selector Débito / Crédito */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Naturaleza Contable</label>
                    <div className="flex bg-[#090d16] p-1 rounded-xl border border-gray-700">
                      <button
                        onClick={() => setFiltroNaturaleza("todos")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                          filtroNaturaleza === "todos" ? "bg-[#18263f] text-white" : "text-gray-400"
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setFiltroNaturaleza("debito")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                          filtroNaturaleza === "debito" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400"
                        }`}
                      >
                        Débito
                      </button>
                      <button
                        onClick={() => setFiltroNaturaleza("credito")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                          filtroNaturaleza === "credito" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-400"
                        }`}
                      >
                        Crédito
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabla de movimientos */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#141f36] text-gray-400 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Fecha</th>
                        <th className="py-3 px-4">Descripción / Tercero</th>
                        <th className="py-3 px-4">Naturaleza</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {movimientosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-gray-500">
                            No se encontraron movimientos con los filtros aplicados.
                          </td>
                        </tr>
                      ) : (
                        movimientosFiltrados.map((m) => (
                          <tr key={m.id} className="hover:bg-[#121c30] transition">
                            <td className="py-3 px-4 font-mono">{m.fecha}</td>
                            <td className="py-3 px-4 font-medium text-white">{m.descripcion}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                m.tipo === "debito" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                {m.tipo}
                              </span>
                            </td>
                            <td className={`py-3 px-4 text-right font-mono font-bold ${
                              m.tipo === "debito" ? "text-green-400" : "text-red-400"
                            }`}>
                              {m.tipo === "debito" ? "+" : "-"}${m.valor.toLocaleString('es-CO')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ESTADÍSTICAS FINANCIERAS (IMAGEN 2) */}
          {activeTab === "estadisticas" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Resumen Financiero del Día Anterior</h1>
                  <p className="text-sm text-gray-400">Extracción automatizada del informe visual de Netlify</p>
                </div>
                <a
                  href="https://informeingresoscostosgastos.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#131d31] hover:bg-[#192742] border border-gray-700 text-yellow-400 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
                >
                  <span>Ver Informe Detallado</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
              </div>

              {/* 5 Recuadros exactamente en el orden de la Imagen 2 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* 1. INGRESOS */}
                <div className="p-5 bg-[#0f1728] border border-blue-900/40 rounded-2xl shadow-lg">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">INGRESOS</span>
                  <p className="text-2xl font-black text-white">19,0 MM</p>
                </div>

                {/* 2. COSTO DE VENTAS */}
                <div className="p-5 bg-[#0f1728] border border-blue-900/40 rounded-2xl shadow-lg">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">COSTO DE VENTAS</span>
                  <p className="text-2xl font-black text-white mb-1">10,5 MM</p>
                  <span className="text-[10px] text-gray-400">55,6% s/ ingresos</span>
                </div>

                {/* 3. UTILIDAD BRUTA */}
                <div className="p-5 bg-[#0f1728] border border-green-900/40 rounded-2xl shadow-lg">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">UTILIDAD BRUTA</span>
                  <p className="text-2xl font-black text-green-400 mb-1">8,4 MM</p>
                  <span className="text-[10px] text-gray-400">Margen 44,4%</span>
                </div>

                {/* 4. GASTOS */}
                <div className="p-5 bg-[#0f1728] border border-yellow-900/40 rounded-2xl shadow-lg">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">GASTOS</span>
                  <p className="text-2xl font-black text-white mb-1">8,9 MM</p>
                  <span className="text-[10px] text-gray-400">47,0% s/ ingresos</span>
                </div>

                {/* 5. RESULTADO NETO */}
                <div className="p-5 bg-[#0f1728] border border-red-900/40 rounded-2xl shadow-lg">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">RESULTADO NETO</span>
                  <p className="text-2xl font-black text-red-400 mb-1">-399,6 M</p>
                  <span className="text-[10px] text-gray-400">Margen -2,1%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FACTURAS AX1 */}
          {activeTab === "facturas" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Facturas Recibidas desde AX1</h1>
                  <p className="text-sm text-gray-400">Sincronización directa y validación para envío a Siigo</p>
                </div>
                <button
                  onClick={() => alert("Bot activado: Generando token DIAN y extrayendo facturas en AX1...")}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  Forzar Sincronización AX1
                </button>
              </div>

              <div className="bg-[#0f1728] border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#141f36] text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Factura</th>
                      <th className="py-3 px-4">Tercero / Emisor</th>
                      <th className="py-3 px-4">Valor Total</th>
                      <th className="py-3 px-4">Estado AX1</th>
                      <th className="py-3 px-4">Estado Siigo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {facturasAX1.map((f) => (
                      <tr key={f.id} className="hover:bg-[#121c30]">
                        <td className="py-3 px-4 font-mono font-bold text-white">{f.id}</td>
                        <td className="py-3 px-4">{f.tercero}</td>
                        <td className="py-3 px-4 font-mono font-semibold">${f.valor.toLocaleString('es-CO')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            f.estado === "verde" 
                              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                              : f.estado === "amarillo" 
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {f.estado === "verde" ? "Verificada" : f.estado === "amarillo" ? "Pendiente" : "Error"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">{f.siigo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NOTAS CRÉDITO */}
          {activeTab === "notas_credito" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-white">Notas Crédito Recibidas</h1>
              <p className="text-sm text-gray-400">Valores y facturas asociadas según aplicativo AX1</p>
              <div className="bg-[#0f1728] border border-gray-800 rounded-2xl p-6">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#141f36] text-gray-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Nota Crédito</th>
                      <th className="py-3 px-4">Factura Afectada</th>
                      <th className="py-3 px-4">Tercero</th>
                      <th className="py-3 px-4 text-right">Valor Afectado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-[#121c30]">
                      <td className="py-3 px-4 font-mono font-bold text-white">NC-089</td>
                      <td className="py-3 px-4 font-mono text-yellow-400">FE-2015</td>
                      <td className="py-3 px-4">AEROTAXIS DEL CARIBE</td>
                      <td className="py-3 px-4 text-right font-mono text-red-400 font-bold">-$1,450,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GASTOS BANCARIOS */}
          {activeTab === "gastos_bancarios" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Gastos Bancarios por Banco</h1>
                  <p className="text-sm text-gray-400">Subida y consolidación mensual de comprobantes contables PDF</p>
                </div>
                <label className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold text-xs rounded-xl cursor-pointer flex items-center space-x-2 transition">
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  <span>Subir Comprobante PDF</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={() => alert("Comprobante PDF guardado y clasificado por banco.")} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-[#0f1728] border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400 uppercase">Octubre 2026 — Bancolombia</span>
                  <h3 className="text-xl font-bold text-white mt-1">$1.420.000</h3>
                  <p className="text-xs text-gray-500 mt-2">Comisiones e impuesto 4x1000</p>
                </div>
                <div className="p-6 bg-[#0f1728] border border-gray-800 rounded-2xl">
                  <span className="text-xs text-gray-400 uppercase">Octubre 2026 — Davivienda</span>
                  <h3 className="text-xl font-bold text-white mt-1">$680.000</h3>
                  <p className="text-xs text-gray-500 mt-2">Mantenimiento de cuenta y transferencias</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE AJUSTES (3 OPCIONES REQUERIDAS) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1728] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Cog6ToothIcon className="w-5 h-5 text-yellow-400" />
                <span>Ajustes y Reportes</span>
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Opción 1: Reporte PDF facturas causadas */}
              <button
                onClick={() => alert("Generando PDF de facturas recibidas y causadas...")}
                className="w-full p-4 bg-[#141f36] hover:bg-[#1a2947] border border-gray-700 rounded-xl text-left flex items-center justify-between transition"
              >
                <div>
                  <p className="text-sm font-semibold text-white">1. Reporte PDF de Facturas</p>
                  <p className="text-xs text-gray-400">Todas las facturas recibidas y causadas al momento</p>
                </div>
                <DocumentArrowDownIcon className="w-5 h-5 text-yellow-400" />
              </button>

              {/* Opción 2: Reporte PDF notas crédito */}
              <button
                onClick={() => alert("Generando PDF de notas crédito con valores y facturas...")}
                className="w-full p-4 bg-[#141f36] hover:bg-[#1a2947] border border-gray-700 rounded-xl text-left flex items-center justify-between transition"
              >
                <div>
                  <p className="text-sm font-semibold text-white">2. Reporte PDF de Notas Crédito</p>
                  <p className="text-xs text-gray-400">Valores y factura a la cual pertenece según AX1</p>
                </div>
                <DocumentArrowDownIcon className="w-5 h-5 text-yellow-400" />
              </button>

              {/* Opción 3: Subida de archivo plano de saldos */}
              <label className="w-full p-4 bg-[#141f36] hover:bg-[#1a2947] border border-gray-700 rounded-xl text-left flex items-center justify-between cursor-pointer transition">
                <div>
                  <p className="text-sm font-semibold text-white">3. Subir Archivo Plano de Saldos</p>
                  <p className="text-xs text-gray-400">Actualiza los saldos de la pestaña Bancos</p>
                </div>
                <ArrowUpTrayIcon className="w-5 h-5 text-yellow-400" />
                <input 
                  type="file" 
                  accept=".csv,.txt" 
                  className="hidden" 
                  onChange={() => {
                    alert("Archivo plano procesado. Saldos de bancos actualizados.");
                    setIsSettingsOpen(false);
                  }} 
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* PANEL DE NOTIFICACIONES Y NOVEDADES */}
      {isNotificationsOpen && (
        <div className="absolute right-6 top-20 w-80 bg-[#0f1728] border border-gray-800 rounded-2xl p-4 shadow-2xl z-40 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Novedades y Errores</h4>
            <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-white">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-300">Error en Factura FE-2044</p>
                <p className="text-[11px] text-gray-400">Fallo en respuesta de token DIAN en Siigo.</p>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-300">Tercero nuevo: COMBUSTIBLES DEL VALLE</p>
                <p className="text-[11px] text-gray-400">Estado amarillo en AX1 impide el envío a Siigo.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
