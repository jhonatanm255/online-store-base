// const express = require("express");
// const cors = require("cors");
// const stripe = require("stripe")(
//   "sk_test_51Quh0eBcjv3gj04dadEHJuCNUukOavWYUwuzCY9qt7rfbqUAYXmW80hGiE5LFPez9fHrqOsYX2YowCcYzIkh77kd00OxX3YLGh"
// );
// const admin = require("firebase-admin");

// // Inicializar Firebase
// const serviceAccount = require("./firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Crear sesión de pago con Stripe
// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { items, userId } = req.body;

//     if (!items || items.length === 0 || !userId) {
//       return res.status(400).json({ error: "Datos inválidos." });
//     }

//     // Crear la sesión de pago con Stripe
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: items.map((item) => ({
//         price_data: {
//           currency: "mxn",
//           product_data: { name: item.name },
//           unit_amount: Math.round(item.price * 100),
//         },
//         quantity: item.quantity,
//       })),
//       mode: "payment",
//       // success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//       // cancel_url: `http://localhost:5173/cancel`,
//       success_url: `https://forniture-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `https://forniture-store.vercel.app/cancel`
//       metadata: { userId }, // Guardar el userId en los metadatos de la sesión
//     });

//     res.status(200).json({ id: session.id });
//   } catch (error) {
//     console.error("Error al crear la Checkout Session:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Verificar el pago y mover datos a la colección "orders"
// app.get("/api/verify-payment", async (req, res) => {
//   try {
//     const { session_id } = req.query;

//     if (!session_id) {
//       return res.status(400).json({ error: "No session_id proporcionado." });
//     }

//     console.log("Recibiendo solicitud de verificación de pago...");
//     console.log("Session ID:", session_id);
//     console.log("Query params:", req.query); // Log de los query params

//     // Recuperar la sesión de Stripe
//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     console.log("Sesión de pago obtenida:", session);
//     console.log("Session metadata:", session.metadata); // Log de los metadatos de la sesión

//     if (!session.metadata || !session.metadata.userId) {
//       return res.status(400).json({ error: "No se pudo obtener el userId." });
//     }

//     const userId = session.metadata.userId;
//     console.log("Usuario ID:", userId);

//     // Verificar si el pago fue exitoso
//     if (session.payment_status !== "paid") {
//       console.error("El pago no fue exitoso:", session.payment_status);
//       return res.status(400).json({ error: "El pago no fue exitoso." });
//     }

//     // Obtener los productos del carrito
//     const cartRef = db.collection("carts").doc(userId);
//     const cartSnap = await cartRef.get();
//     console.log("Cart snapshot:", cartSnap.data()); // Log del snapshot del carrito

//     if (!cartSnap.exists) {
//       console.warn(`Carrito no encontrado para el usuario: ${userId}`);
//       return res.status(200).json({
//         success: false,
//         message: "El carrito ya fue procesado o no existe.",
//       });
//     }

//     const cartItems = cartSnap.data().items || [];
//     console.log("Productos en el carrito:", cartItems);

//     if (cartItems.length === 0) {
//       return res.status(400).json({ error: "El carrito está vacío." });
//     }

//     // Calcular el total de manera segura
//     const total = cartItems.reduce((total, item) => {
//       if (!item.price || !item.quantity) {
//         console.warn("Producto inválido en el carrito:", item);
//         return total;
//       }
//       return total + item.price * item.quantity;
//     }, 0);
//     console.log("Total calculado:", total);

//     // Crear la orden en la colección "orders"
//     const orderRef = db.collection("orders").doc();
//     await orderRef.set({
//       userId,
//       items: cartItems,
//       total,
//       status: "paid",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     console.log("Orden creada con ID:", orderRef.id);
//     console.log("Orden creada:", {
//       userId,
//       items: cartItems,
//       total,
//       status: "paid",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     }); // Log de la orden creada

//     // Eliminar el carrito
//     await cartRef.delete();
//     console.log("Carrito eliminado para el usuario:", userId);

//     // Responder al frontend con éxito
//     res.status(200).json({
//       success: true,
//       orderId: orderRef.id,
//       message: "Pago confirmado y orden creada exitosamente.",
//       products: cartItems,
//     });
//   } catch (error) {
//     console.error("Error al verificar el pago:", error);
//     console.error("Error details:", error.stack); // Log del stack del error
//     res.status(500).json({ error: "Error interno del servidor." });
//   }
// });

// // Iniciar el servidor
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });






const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Quh0eBcjv3gj04dadEHJuCNUukOavWYUwuzCY9qt7rfbqUAYXmW80hGiE5LFPez9fHrqOsYX2YowCcYzIkh77kd00OxX3YLGh"
);
const admin = require("firebase-admin");

// Inicializar Firebase
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "https://forniture-store.vercel.app", // Permitir solo solicitudes desde este origen
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Permitir cookies y encabezados de autenticación
};

app.use(cors(corsOptions)); // Aplicar CORS con las opciones configuradas
app.use(express.json());

// Crear sesión de pago con Stripe
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, userId } = req.body;

    if (!items || items.length === 0 || !userId) {
      return res.status(400).json({ error: "Datos inválidos." });
    }

    // Crear la sesión de pago con Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "mxn",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `https://forniture-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://forniture-store.vercel.app/cancel`,
      metadata: { userId }, // Guardar el userId en los metadatos de la sesión
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error al crear la Checkout Session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verificar el pago y mover datos a la colección "orders"
app.get("/api/verify-payment", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "No session_id proporcionado." });
    }

    console.log("Recibiendo solicitud de verificación de pago...");
    console.log("Session ID:", session_id);
    console.log("Query params:", req.query); // Log de los query params

    // Recuperar la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Sesión de pago obtenida:", session);
    console.log("Session metadata:", session.metadata); // Log de los metadatos de la sesión

    if (!session.metadata || !session.metadata.userId) {
      return res.status(400).json({ error: "No se pudo obtener el userId." });
    }

    const userId = session.metadata.userId;
    console.log("Usuario ID:", userId);

    // Verificar si el pago fue exitoso
    if (session.payment_status !== "paid") {
      console.error("El pago no fue exitoso:", session.payment_status);
      return res.status(400).json({ error: "El pago no fue exitoso." });
    }

    // Obtener los productos del carrito
    const cartRef = db.collection("carts").doc(userId);
    const cartSnap = await cartRef.get();
    console.log("Cart snapshot:", cartSnap.data()); // Log del snapshot del carrito

    if (!cartSnap.exists) {
      console.warn(`Carrito no encontrado para el usuario: ${userId}`);
      return res.status(200).json({
        success: false,
        message: "El carrito ya fue procesado o no existe.",
      });
    }

    const cartItems = cartSnap.data().items || [];
    console.log("Productos en el carrito:", cartItems);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }

    // Calcular el total de manera segura
    const total = cartItems.reduce((total, item) => {
      if (!item.price || !item.quantity) {
        console.warn("Producto inválido en el carrito:", item);
        return total;
      }
      return total + item.price * item.quantity;
    }, 0);
    console.log("Total calculado:", total);

    // Crear la orden en la colección "orders"
    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      userId,
      items: cartItems,
      total,
      status: "paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Orden creada con ID:", orderRef.id);
    console.log("Orden creada:", {
      userId,
      items: cartItems,
      total,
      status: "paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }); // Log de la orden creada

    // Eliminar el carrito
    await cartRef.delete();
    console.log("Carrito eliminado para el usuario:", userId);

    // Responder al frontend con éxito
    res.status(200).json({
      success: true,
      orderId: orderRef.id,
      message: "Pago confirmado y orden creada exitosamente.",
      products: cartItems,
    });
  } catch (error) {
    console.error("Error al verificar el pago:", error);
    console.error("Error details:", error.stack); // Log del stack del error
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});