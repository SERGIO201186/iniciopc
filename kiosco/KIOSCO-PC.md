# Omnia Control como launcher (modo kiosco) en la PC

Esta guía convierte este panel en la pantalla de inicio de una PC (por ejemplo
la de recepción/empleados): la PC arranca directo en el panel, a pantalla
completa, sin barra de direcciones ni forma sencilla de salir a otras páginas.

Se hace en dos partes: **1)** publicar el panel para que tenga una dirección
web fija, y **2)** configurar la PC de Windows para que lo abra en modo
kiosco automáticamente.

---

## 1. Publicar el panel (una sola vez)

Este repositorio ya incluye un workflow (`.github/workflows/deploy-pages.yml`)
que publica el panel en GitHub Pages automáticamente cada vez que se hace
push a `main`. Falta un paso manual, de una sola vez:

1. En GitHub, entra al repo → **Settings → Pages**.
2. En "Build and deployment" → "Source", elige **GitHub Actions**.
3. Guarda. En un par de minutos el panel queda publicado en:

   ```
   https://sergio201186.github.io/iniciopc/
   ```

Cada vez que se haga push a `main`, esa URL se actualiza sola con la última
versión del panel.

> Si el repo no se llama `iniciopc` o el usuario/organización de GitHub es
> otro, la URL cambia: `https://<usuario>.github.io/<repo>/`. Ajusta la
> variable `PANEL_URL` dentro de `iniciar-kiosco.bat` si es tu caso.

---

## 2. Configurar la PC de Windows

### Paso 1 — Copiar el script

Copia la carpeta `kiosco` completa (o al menos `iniciar-kiosco.bat`) a la PC,
por ejemplo a `C:\OmniaKiosco\`.

### Paso 2 — Probarlo

Doble clic en `iniciar-kiosco.bat`. Debe abrir Chrome o Edge a pantalla
completa, directo en el panel, sin barra de direcciones. Usa un perfil de
navegador aparte (`OmniaKiosco`), así que no toca marcadores, sesiones ni
extensiones del navegador normal.

### Paso 3 — Que arranque solo con la PC

Opción simple (recomendada para empezar):

1. `Win + R` → escribe `shell:startup` → Enter.
2. Crea un acceso directo a `iniciar-kiosco.bat` dentro de esa carpeta
   (clic derecho sobre el .bat → Enviar a → Escritorio, y luego mueve/copia
   ese acceso directo a la carpeta que abrió `shell:startup`).
3. Reinicia la PC para comprobar que abre el panel solo, al iniciar sesión.

Para que la PC llegue a ese punto sin que nadie tenga que iniciar sesión a
mano, activa el inicio de sesión automático de Windows con una cuenta
dedicada (Ejecutar → `netplwiz` → desmarcar "Los usuarios deben escribir su
nombre..." → aplicar).

Opción más robusta (si quieres que se reabra solo si alguien lo cierra):
usa el **Programador de tareas** de Windows y crea una tarea con
desencadenador "Al iniciar sesión" y acción "Iniciar un programa" apuntando
a `iniciar-kiosco.bat`.

### Paso 4 — (Opcional) Bloqueo más estricto a nivel Windows

El modo kiosco del navegador quita la barra de direcciones y pestañas, pero
NO bloquea atajos de Windows como `Alt+Tab`, `Win`, o `Ctrl+Alt+Supr`. Si
necesitas que la PC quede realmente restringida a solo este panel, usa el
**modo kiosco de Windows** (Configuración → Cuentas → Otros usuarios →
Configurar un kiosco), que restringe toda la sesión de esa cuenta a una sola
app.

### Cómo salir del modo kiosco (para el administrador)

- `Ctrl + Alt + Supr` → Administrador de tareas → busca `chrome.exe` o
  `msedge.exe` → Finalizar tarea.
- O `Alt + F4` para cerrar la ventana.

---

## Resumen para quien solo quiere usarlo

Una vez configurado el Paso 3, no hay que hacer nada: enciendes la PC y el
panel abre solo.
