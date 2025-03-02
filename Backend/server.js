const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Quh0eBcjv3gj04dadEHJuCNUukOavWYUwuzCY9qt7rfbqUAYXmW80hGiE5LFPez9fHrqOsYX2YowCcYzIkh77kd00OxX3YLGh"
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    const { items, orderId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron productos." });
    }

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
      // success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `http://localhost:5173/cancel`,
      metadata: { orderId },
    });

    console.log("Sesión creada:", session);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error al crear la Checkout Session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/verify-payment", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "No session_id provided" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.status(200).json({
      success: session.payment_status === "paid",
      orderId: session.metadata.orderId,
    });
  } catch (error) {
    console.error("Error al verificar la sesión de pago:", error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exporta la app para Vercel
// module.exports = app;
