/**
 * TRENDSTORE BACKEND - GOOGLE APPS SCRIPT
 * 
 * INSTRUCCIONES DE USO:
 * 1. Crea un nuevo Google Sheet y llámalo "TrendStore DB".
 * 2. Crea las siguientes pestañas (hojas) en el Sheet: 
 *    "Products", "Categories", "Orders", "Sliders", "Coupons", "Users", "Notifications"
 * 3. Ve a Extensiones > Apps Script y pega todo este código.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 * 5. Selecciona "Aplicación web".
 * 6. Ejecutar como: "Tú" | Quién tiene acceso: "Cualquier persona".
 * 7. Copia la URL de la aplicación web y pégala en tu archivo config.js (API_URL).
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
// Opcional: ID de la carpeta de Drive donde se guardarán los comprobantes de pago
// Si está vacío, se guardarán en la raíz de tu Drive.
const DRIVE_FOLDER_ID = ""; 

/**
 * MANEJO DE PETICIONES GET (Leer datos)
 */
function doGet(e) {
  const action = e.parameter.action;
  const adminKey = e.parameter.adminKey;
  let result = [];

  try {
    switch (action) {
      case 'products':
        result = getSheetData('Products');
        // Parsear arrays stringificados
        result = result.map(p => {
          if(p.images) p.images = JSON.parse(p.images);
          if(p.sizes) p.sizes = JSON.parse(p.sizes);
          if(p.colors) p.colors = JSON.parse(p.colors);
          return p;
        });
        break;
      case 'categories':
        result = getSheetData('Categories');
        break;
      case 'orders':
        result = getSheetData('Orders');
        break;
      case 'sliders':
        result = getSheetData('Sliders');
        break;
      case 'coupons':
        result = getSheetData('Coupons');
        break;
      case 'users':
        if (verifyAdminKey(adminKey)) {
          result = getSheetData('Users');
        } else {
          result = { error: "No autorizado" };
        }
        break;
      case 'notifications':
        if (verifyAdminKey(adminKey)) {
          result = getSheetData('Notifications');
        } else {
          result = { error: "No autorizado" };
        }
        break;
      case 'stats':
        if (verifyAdminKey(adminKey)) {
          result = getDashboardStats();
        } else {
          result = { error: "No autorizado" };
        }
        break;
      default:
        result = { error: "Acción no válida o no especificada." };
    }
  } catch (error) {
    result = { error: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * MANEJO DE PETICIONES POST (Guardar datos, Crear Pedidos, Subir Imágenes)
 */
function doPost(e) {
  let response = { success: false };
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const adminKey = data.adminKey;

    // Validar clave de admin para operaciones sensibles
    if (['editProduct', 'deleteProduct', 'editCategory', 'deleteCategory', 'updateOrderStatus', 
         'editCoupon', 'deleteCoupon', 'createNotification', 'updateSettings'].includes(action)) {
      if (!verifyAdminKey(adminKey)) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No autorizado" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'createOrder') {
      response = handleCreateOrder(data);
    } 
    else if (action === 'createProduct') {
      response = handleCreateProduct(data);
    } 
    else if (action === 'editProduct') {
      response = handleEditProduct(data);
    } 
    else if (action === 'deleteProduct') {
      response = handleDeleteProduct(data);
    } 
    else if (action === 'createCategory') {
      response = handleCreateCategory(data);
    } 
    else if (action === 'editCategory') {
      response = handleEditCategory(data);
    } 
    else if (action === 'deleteCategory') {
      response = handleDeleteCategory(data);
    }
    else if (action === 'updateOrderStatus') {
      response = handleUpdateOrderStatus(data);
    }
    else if (action === 'createCoupon') {
      response = handleCreateCoupon(data);
    }
    else if (action === 'editCoupon') {
      response = handleEditCoupon(data);
    }
    else if (action === 'deleteCoupon') {
      response = handleDeleteCoupon(data);
    }
    else if (action === 'createNotification') {
      response = handleCreateNotification(data);
    }
    else if (action === 'updateSettings') {
      response = handleUpdateSettings(data);
    }
    else {
      response = { success: false, error: "Acción POST no válida." };
    }

  } catch (error) {
    response = { success: false, error: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * FUNCIÓN AUXILIAR: Leer datos de una hoja y convertirlos en Array de Objetos JSON
 */
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Hoja vacía o solo con encabezados

  const headers = data[0];
  const rows = data.slice(1);
  const result = [];

  for (let i = 0; i < rows.length; i++) {
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = rows[i][j];
    }
    result.push(obj);
  }

  return result;
}

/**
 * FUNCIÓN AUXILIAR: Insertar una nueva fila en una hoja específica
 */
function appendRowToSheet(sheetName, rowData) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  if (sheet) {
    sheet.appendRow(rowData);
  } else {
    throw new Error(`La hoja ${sheetName} no existe en el documento.`);
  }
}

/**
 * FUNCIÓN AUXILIAR: Decodificar Base64 y guardar imagen en Google Drive
 */
function saveImageToDrive(base64Data, filename) {
  try {
    // El formato suele ser: data:image/png;base64,iVBORw0KGgo...
    const splitData = base64Data.split(',');
    const type = splitData[0].split(';')[0].replace('data:', '');
    const base64Str = splitData[1];

    const blob = Utilities.base64Decode(base64Str);
    const fileBlob = Utilities.newBlob(blob, type, filename);

    let folder;
    if (DRIVE_FOLDER_ID) {
      folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    } else {
      folder = DriveApp.getRootFolder();
    }

    const file = folder.createFile(fileBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (e) {
    return "Error al guardar imagen: " + e.toString();
  }
}

/**
 * FUNCIÓN DE CONFIGURACIÓN INICIAL (Ejecutar una vez desde el editor de Apps Script)
 * Crea las hojas necesarias con sus encabezados si no existen.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const requiredSheets = {
    'Products': ['id', 'name', 'price', 'originalPrice', 'category', 'images', 'sizes', 'colors', 'stock', 'description'],
    'Categories': ['id', 'name', 'status'],
    'Orders': ['id', 'customerName', 'customerPhone', 'customerAddress', 'total', 'method', 'status', 'date', 'itemsJSON', 'receiptUrl'],
    'Sliders': ['id', 'title', 'subtitle', 'image', 'link', 'buttonText'],
    'Coupons': ['id', 'code', 'discount', 'status', 'expires'],
    'Users': ['id', 'name', 'email', 'role', 'status', 'registered'],
    'Notifications': ['id', 'title', 'message', 'type', 'date', 'read'],
    'Settings': ['key', 'value']
  };

  for (const sheetName in requiredSheets) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(requiredSheets[sheetName]);
      // Dar formato a los encabezados
      sheet.getRange(1, 1, 1, requiredSheets[sheetName].length).setFontWeight("bold").setBackground("#f3f4f6");
    }
  }
}

/**
 * FUNCIÓN DE SEGURIDAD: Verificar clave de admin
 */
function verifyAdminKey(key) {
  // CAMBIAR ESTO: Reemplaza 'admin123' con tu clave segura
  const ADMIN_KEY = "admin123";
  return key === ADMIN_KEY;
}

/**
 * FUNCIONES DE MANEJO DE ÓRDENES
 */
function handleCreateOrder(data) {
  let receiptUrl = "";
  
  if (data.receiptImage) {
    receiptUrl = saveImageToDrive(data.receiptImage, `Comprobante_${Date.now()}`);
  }

  const orderId = 'ORD-' + Date.now();
  
  const newRow = [
    orderId,
    data.customer.name,
    data.customer.phone,
    data.customer.address,
    data.total,
    data.paymentMethod,
    "Pendiente",
    data.date,
    JSON.stringify(data.items),
    receiptUrl
  ];

  appendRowToSheet('Orders', newRow);

  let init_point = null;
  if (data.paymentMethod === 'mercadopago') {
    init_point = "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=MOCK";
  }

  return { 
    success: true, 
    orderId: orderId, 
    init_point: init_point,
    message: "Pedido creado exitosamente" 
  };
}

function handleUpdateOrderStatus(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Orders');
  if (!sheet) return { success: false, error: "Hoja Orders no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.orderId) {
      sheet.getRange(i + 1, 7).setValue(data.status); // Columna 'status'
      return { success: true, message: "Estado de orden actualizado" };
    }
  }

  return { success: false, error: "Orden no encontrada" };
}

/**
 * FUNCIONES DE MANEJO DE PRODUCTOS
 */
function handleCreateProduct(data) {
  const productId = 'PROD-' + Date.now();
  
  const newRow = [
    productId,
    data.name,
    data.price,
    data.originalPrice || "",
    data.category,
    JSON.stringify(data.images || []),
    JSON.stringify(data.sizes || []),
    JSON.stringify(data.colors || []),
    data.stock || 0,
    data.description || ""
  ];

  appendRowToSheet('Products', newRow);
  
  return { 
    success: true, 
    productId: productId,
    message: "Producto creado exitosamente" 
  };
}

function handleEditProduct(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Products');
  if (!sheet) return { success: false, error: "Hoja Products no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      const range = sheet.getRange(i + 1, 1, 1, 10);
      range.setValues([[
        data.id,
        data.name,
        data.price,
        data.originalPrice || "",
        data.category,
        JSON.stringify(data.images || []),
        JSON.stringify(data.sizes || []),
        JSON.stringify(data.colors || []),
        data.stock || 0,
        data.description || ""
      ]]);
      return { success: true, message: "Producto actualizado" };
    }
  }

  return { success: false, error: "Producto no encontrado" };
}

function handleDeleteProduct(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Products');
  if (!sheet) return { success: false, error: "Hoja Products no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Producto eliminado" };
    }
  }

  return { success: false, error: "Producto no encontrado" };
}

/**
 * FUNCIONES DE MANEJO DE CATEGORÍAS
 */
function handleCreateCategory(data) {
  const categoryId = 'CAT-' + Date.now();
  
  const newRow = [
    categoryId,
    data.name,
    data.status || "Activo"
  ];

  appendRowToSheet('Categories', newRow);
  
  return { 
    success: true, 
    categoryId: categoryId,
    message: "Categoría creada exitosamente" 
  };
}

function handleEditCategory(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Categories');
  if (!sheet) return { success: false, error: "Hoja Categories no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 3).setValue(data.status);
      return { success: true, message: "Categoría actualizada" };
    }
  }

  return { success: false, error: "Categoría no encontrada" };
}

function handleDeleteCategory(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Categories');
  if (!sheet) return { success: false, error: "Hoja Categories no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Categoría eliminada" };
    }
  }

  return { success: false, error: "Categoría no encontrada" };
}

/**
 * FUNCIONES DE MANEJO DE CUPONES
 */
function handleCreateCoupon(data) {
  const couponId = 'CPN-' + Date.now();
  
  const newRow = [
    couponId,
    data.code,
    data.discount,
    data.status || "Activo",
    data.expires || ""
  ];

  appendRowToSheet('Coupons', newRow);
  
  return { 
    success: true, 
    couponId: couponId,
    message: "Cupón creado exitosamente" 
  };
}

function handleEditCoupon(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Coupons');
  if (!sheet) return { success: false, error: "Hoja Coupons no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.getRange(i + 1, 2).setValue(data.code);
      sheet.getRange(i + 1, 3).setValue(data.discount);
      sheet.getRange(i + 1, 4).setValue(data.status);
      sheet.getRange(i + 1, 5).setValue(data.expires);
      return { success: true, message: "Cupón actualizado" };
    }
  }

  return { success: false, error: "Cupón no encontrado" };
}

function handleDeleteCoupon(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Coupons');
  if (!sheet) return { success: false, error: "Hoja Coupons no existe" };

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Cupón eliminado" };
    }
  }

  return { success: false, error: "Cupón no encontrado" };
}

/**
 * FUNCIONES DE MANEJO DE NOTIFICACIONES
 */
function handleCreateNotification(data) {
  const notifId = 'NOTIF-' + Date.now();
  
  const newRow = [
    notifId,
    data.title,
    data.message,
    data.type,
    new Date().toString(),
    "false"
  ];

  appendRowToSheet('Notifications', newRow);
  
  return { 
    success: true, 
    notificationId: notifId,
    message: "Notificación creada exitosamente" 
  };
}

/**
 * FUNCIONES DE MANEJO DE CONFIGURACIÓN
 */
function handleUpdateSettings(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Settings');
  let updated = [];
  
  for (const key in data.settings) {
    const value = data.settings[key];
    const rows = sheet.getDataRange().getValues();
    let found = false;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        found = true;
        break;
      }
    }
    
    if (!found) {
      appendRowToSheet('Settings', [key, value]);
    }
    updated.push(key);
  }

  return { 
    success: true, 
    updated: updated,
    message: "Configuración actualizada" 
  };
}

/**
 * FUNCIÓN AUXILIAR: Obtener estadísticas del dashboard
 */
function getDashboardStats() {
  const ordersSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Orders');
  const productsSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Products');
  const usersSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Users');
  
  let totalSales = 0;
  let totalOrders = 0;
  let recentOrders = [];
  let productStats = {};
  let paymentMethods = { mercadopago: 0, yape: 0, plin: 0, otros: 0 };
  
  // Procesar órdenes
  if (ordersSheet) {
    const ordersData = getSheetData('Orders');
    totalOrders = ordersData.length;
    recentOrders = ordersData.slice(-5).reverse();
    
    ordersData.forEach(order => {
      totalSales += Number(order.total) || 0;
      const method = order.method || 'otros';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
  }
  
  // Procesar productos
  if (productsSheet) {
    const productsData = getSheetData('Products');
    productsData.forEach(product => {
      productStats[product.name] = { price: product.price, stock: product.stock };
    });
  }
  
  const activeUsers = usersSheet ? getSheetData('Users').length : 0;
  
  return {
    totalSales: totalSales,
    totalOrders: totalOrders,
    activeUsers: activeUsers,
    recentOrders: recentOrders,
    paymentMethods: paymentMethods,
    products: productStats,
    lastUpdated: new Date().toString()
  };
}
