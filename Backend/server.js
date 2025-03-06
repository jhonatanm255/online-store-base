// const express = require("express");
// const cors = require("cors");
// const stripe = require("stripe")(
//   "sk_test_51Quh0eBcjv3gj04dadEHJuCNUukOavWYUwuzCY9qt7rfbqUAYXmW80hGiE5LFPez9fHrqOsYX2YowCcYzIkh77kd00OxX3YLGh"
// );

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     console.log("Datos recibidos:", req.body);
//     const { items, orderId } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ error: "No se proporcionaron productos." });
//     }

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
//       success_url: `https://forniture-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `https://forniture-store.vercel.app/cancel`,
//       // success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//       // cancel_url: `http://localhost:5173/cancel`,
//       metadata: { orderId },
//     });

//     console.log("Sesión creada:", session);
//     res.status(200).json({ id: session.id });
//   } catch (error) {
//     console.error("Error al crear la Checkout Session:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/api/verify-payment", async (req, res) => {
//   try {
//     const { session_id } = req.query;

//     if (!session_id) {
//       return res.status(400).json({ error: "No session_id provided" });
//     }

//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     res.status(200).json({
//       success: session.payment_status === "paid",
//       orderId: session.metadata.orderId,
//     });
//   } catch (error) {
//     console.error("Error al verificar la sesión de pago:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Iniciar el servidor
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

// // Exporta la app para Vercel
// // module.exports = app;





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

// Middleware
app.use(cors());
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
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      // success_url: `https://forniture-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `https://forniture-store.vercel.app/cancel`,
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

    console.log("Verificando pago para la sesión:", session_id);

    // Recuperar la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Sesión recuperada:", session);

    // Verificar si el pago fue exitoso
    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "El pago no fue exitoso." });
    }

    const userId = session.metadata.userId;
    console.log("Usuario ID:", userId);

    // Obtener los productos del carrito de Firebase
    const cartRef = db.collection("carts").doc(userId);
    const cartSnap = await cartRef.get();

    if (!cartSnap.exists) {
      return res.status(400).json({ error: "Carrito no encontrado." });
    }

    const cartItems = cartSnap.data().items || [];
    console.log("Productos en el carrito:", cartItems);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }

    // Crear la orden en la colección "orders"
    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      userId,
      items: cartItems,
      total: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      status: "paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Orden creada con ID:", orderRef.id);

    // Eliminar el carrito
    await cartRef.delete();
    console.log("Carrito eliminado para el usuario:", userId);

    // Responder al frontend con éxito
    res.status(200).json({
      success: true,
      orderId: orderRef.id,
      message: "Pago confirmado y orden creada exitosamente.",
      products: cartItems, // Incluir los productos en la respuesta
    });
  } catch (error) {
    console.error("Error al verificar el pago:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});