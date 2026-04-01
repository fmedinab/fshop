# 📖 Guía de Deployment - TrendStore en GitHub Pages + Google Apps Script

## 🎯 Arquitectura

```
┌─────────────────────────────────────────────┐
│         GITHUB PAGES (Frontend)              │
│  Static: HTML, CSS, JS, Components          │
│  URL: tu-usuario.github.io/EcommerceF       │
└──────────────────I─────────────────────────┘
                   │ HTTP/CORS
                   │
┌──────────────────v─────────────────────────┐
│     GOOGLE APPS SCRIPT (Backend API)        │
│  Dynamic: Google Sheets + Apps Script       │
│  URL: script.google.com/macros/s/[ID]/exec  │
└─────────────────────────────────────────────┘
```

---

## 📝 Paso 1: Configurar Google Apps Script

### A. Crear el Backend
1. Ve a [Google Apps Script](https://script.google.com)
2. **Nuevo proyecto** → Nombra: "TrendStore Backend"
3. Copia todo el contenido de `backend/Code.gs`
4. Pega en el editor de Apps Script
5. **Ejecutar** → `setupDatabase()` (Una sola vez)
   - Esto crea todas las hojas en Google Sheets automáticamente

### B. Crear Google Sheet
1. Ve a [Google Drive](https://drive.google.com)
2. Crea un nuevo Google Sheet llamado **"TrendStore DB"**
3. En Apps Script: Extensiones → Editor de Apps Script
4. En el código: Reemplaza `SpreadsheetApp.getActiveSpreadsheet().getId()`
   - Copia el ID de tu Google Sheet (URL: `/spreadsheets/d/{ID}/edit`)
   - Actualiza la línea: `const SPREADSHEET_ID = "TU-ID-AQUI"`

### C. Cambiar Clave de Admin (IMPORTANTE)
En `Code.gs`, línea ~230, reemplaza:
```javascript
const ADMIN_KEY = "admin123";  // ❌ INSEGURO
```

Con una clave segura:
```javascript
const ADMIN_KEY = "tu-clave-super-segura-123abc";  // ✅ SEGURO
```

### D. Deployar como Web App
1. En Apps Script: **Implementar** → **Nueva implementación**
2. Tipo: **Aplicación web**
3. Ejecutar como: **Tu cuenta**
4. Quién tiene acceso: **Cualquier persona**
5. **Copiar URL** de despliegue:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   ```

---

## 🚀 Paso 2: Configurar Frontend (GitHub Pages)

### A. Actualizar config.js
En `config/config.js`, reemplaza:
```javascript
API_URL: "https://script.google.com/macros/s/AKfycbz7O9xD3DIKaA_u-SEsuDkq61_DdYaon6xq-Xzb2rYvZFW3nlxKkSrA-AmOLZXCZobE/exec"
```

Con tu URL de Google Apps Script:
```javascript
API_URL: "https://script.google.com/macros/s/[TU-DEPLOYMENT-ID]/exec"
```

### B. Crear repositorio en GitHub
1. Ve a [GitHub](https://github.com/new)
2. Crea un repositorio: `EcommerceF`
3. En tu máquina local:
   ```bash
   cd c:\Users\frank\Desktop\EcommerceF
   git init
   git add .
   git commit -m "Initial commit: TrendStore"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/EcommerceF.git
   git push -u origin main
   ```

### C. Habilitar GitHub Pages
1. En GitHub: **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** | Carpeta: **/(root)**
4. Espera 1-2 minutos
5. Tu sitio estará en: `https://tu-usuario.github.io/EcommerceF`

---

## 🔧 Paso 3: Configuración de CORS

Google Apps Script permite CORS por defecto cuando se despliega como "Cualquier persona".

✅ **Ya funcionará automáticamente desde GitHub Pages**

Si tienes problemas, verifica:
- ✅ Content-Type: `text/plain;charset=utf-8` (en las llamadas POST)
- ✅ Method: GET para lectura, POST para crear/editar
- ✅ Deployment: "Cualquier persona" (no restringido)

---

## 🧪 Paso 4: Pruebas

### Verificar que funciona en localhost
```bash
# Como estás usando fetch, necesitas un servidor local
# Opción 1: Python (si tienes Python 3)
python -m http.server 8000

# Opción 2: Node.js (si tienes Node)
npx http-server

# Luego abre: http://localhost:8000
```

### Pruebas que debes hacer:
1. ✅ Carga de productos: `GET /products`
2. ✅ Carga de categorías: `GET /categories`
3. ✅ Crear orden: `POST /createOrder`
4. ✅ Admin: crear producto (con adminKey)

### Si ves errores de CORS:
```javascript
// En browser console (F12):
// Debería ver requests a: script.google.com/macros/s/...
// y respuestas 200 OK
```

---

## 📱 Usar desde GitHub Pages

Una vez que subes a GitHub Pages:
1. Tu site: `https://tu-usuario.github.io/EcommerceF`
2. Las llamadas irán a Google Apps Script automáticamente
3. No necesitas cambiar nada en el código

---

## 🛡️ Seguridad

### Recomendaciones:
1. **Cambiar ADMIN_KEY** en Code.gs (NO usar "admin123")
2. **Mantener Google Sheet privado** (solo compartir con tu email)
3. **No publicar credenciales** en GitHub
   - Crea un `.env` local (NO commitear a GitHub)
4. **Usar HTTPS** (GitHub Pages usa HTTPS por defecto ✅)
5. **Limitar acceso a admin** (verificar ADMIN_KEY en cada request)

---

## 🐛 Troubleshooting

### "CORS error" o "Blocked by CORS policy"
```
Solución: 
- Verifica URL en config.js
- Deployment debe ser "Cualquier persona"
- Redeploy: Implementar → Nueva implementación
```

### "Error: API Response 401 Unauthorized"
```
Solución:
- Verificar ADMIN_KEY es correcta
- Usar config.js para enviarlo automáticamente
```

### "404 ProductNotFound" desde GitHub Pages pero funciona en localhost
```
Solución:
- CORS: Asegura que Header es correcto
- Content-Type: 'text/plain;charset=utf-8'
```

### Google Apps Script devuelve error de permisos
```
Solución:
- Ir a Apps Script → Permisos
- Revisar que está "Ejecutando como: Tu cuenta"
- Si pregunta autorización, clickea "Autorizar" completamente
```

---

## 📊 Monitorar API

En Google Apps Script, puedes ver logs:
1. Ejecutiones (Ej) → Historial de ejecución
2. Filtrar por fecha/hora
3. Ver si hubo errores o demoralización

---

## 🎬 Quick Setup Checklist

- [ ] Google Apps Script creado y desplegado
- [ ] ADMIN_KEY cambiada a algo seguro
- [ ] Google Sheet vinculado y setupeada
- [ ] config.js actualizado con nueva URL de API
- [ ] Repositorio GitHub creado y código pusheado
- [ ] GitHub Pages habilitado en Settings
- [ ] Pruebas locales exitosas
- [ ] Pruebas desde https://tu-usuario.github.io/EcommerceF

---

## 📞 Contacto / Soporte

Si hay problemas:
1. Verifica los logs de Google Apps Script
2. Abre F12 en el navegador (Developer Tools)
3. Mira Network → Requests a script.google.com
4. Verifica que la respuesta sea JSON válido

---

**¡Felicidades! Tu tienda virtual está online 🎉**
