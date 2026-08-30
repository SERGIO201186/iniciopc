// ============================================================================
// OMNIA CONTROL · Panel de Acceso — backend de MOVIMIENTOS (base de datos PROPIA)
// ============================================================================
// Este script es INDEPENDIENTE del script/hoja de "Colaboradores" que ya usan
// las apps de Previsión y ODS (funeraria-huerta). Ese otro script solo se usa
// desde index.html para VALIDAR el acceso (accion "validarAcceso") — nunca
// guarda nada aqui. Este script, en cambio, es la base de datos PROPIA de
// este panel: guarda cada movimiento (ingreso, apertura de módulo, bloqueo)
// que hace cada colaborador al usar el panel.
//
// ---- Cómo desplegarlo (una sola vez) ----
// 1. Crea una hoja de cálculo nueva en Google Sheets (puede llamarse, por
//    ejemplo, "Omnia Control - Movimientos"). No hace falta crear ninguna
//    pestaña a mano: este script crea la hoja "Movimientos" solo la primera
//    vez que alguien inicia sesión.
// 2. Extensiones → Apps Script. Borra el código de ejemplo y pega TODO el
//    contenido de este archivo.
// 3. Implementar → Nueva implementación → tipo "Aplicación web".
//      Ejecutar como: Yo (tu cuenta).
//      Quién tiene acceso: Cualquier usuario.
// 4. Copia la URL que termina en /exec.
// 5. En el panel (index.html), botón "⚙ Configurar conexión" → pega esa URL
//    en el segundo campo ("URL del Apps Script de MOVIMIENTOS"). Se guarda
//    solo en ese dispositivo/navegador (localStorage).
// ============================================================================

const SH_MOV = "Movimientos";
const MOV_COLS = ["timestamp", "colaboradorId", "colaboradorNombre", "movimiento", "detalle", "dispositivo"];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const accion = payload.accion || "";
    let result;
    switch (accion) {
      case "ping":
        result = { ok: true, mensaje: "Servidor de movimientos Omnia Control activo ✓" };
        break;
      case "registrarMovimiento":
        result = registrarMovimiento(payload);
        break;
      case "obtenerMovimientos":
        result = obtenerMovimientos(payload.filtros || {});
        break;
      default:
        result = { ok: false, mensaje: "Acción desconocida: " + accion };
    }
    return jsonOut(result);
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

function doGet(e) {
  // Permite consultar el historial desde el navegador con
  // ?accion=obtenerMovimientos&colaboradorId=... (uso interno/administrativo).
  if (e && e.parameter && e.parameter.accion === "obtenerMovimientos") {
    return jsonOut(obtenerMovimientos(e.parameter));
  }
  return jsonOut({ ok: true, mensaje: "Servidor de movimientos Omnia Control activo ✓" });
}

function getMovSh() {
  return initSheet(SH_MOV, MOV_COLS);
}

function initSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Guarda un movimiento del colaborador (ingreso, apertura de módulo, bloqueo,
// etc.). No exige contraseña/PIN: la validación real de identidad ya la hizo
// el otro script (el de Colaboradores) antes de que el panel llame aqui.
function registrarMovimiento(payload) {
  if (!payload) return { ok: false, mensaje: "Falta información del movimiento" };
  const sh = getMovSh();
  sh.appendRow([
    new Date().toISOString(),
    payload.colaboradorId || "",
    payload.colaboradorNombre || "",
    payload.movimiento || "",
    payload.detalle || "",
    payload.dispositivo || ""
  ]);
  return { ok: true };
}

function obtenerMovimientos(filtros) {
  const sh = getMovSh();
  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return { ok: true, datos: [] };
  const headers = data[0];
  let filas = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
  if (filtros.colaboradorId) {
    filas = filas.filter(f => String(f.colaboradorId) === String(filtros.colaboradorId));
  }
  if (filtros.desde) {
    const desde = new Date(filtros.desde);
    filas = filas.filter(f => new Date(f.timestamp) >= desde);
  }
  return { ok: true, datos: filas };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
