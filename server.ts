import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Tabliya API is running" });
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "egp" } = req.body;
      const stripeClient = getStripe();

      if (!stripeClient) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents/piastres
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Socket.io
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-order", (orderId) => {
      socket.join(orderId);
      console.log(`User joined order room: ${orderId}`);
    });

    socket.on("update-location", (data) => {
      const { orderId, location } = data;
      io.to(orderId).emit("location-updated", { orderId, location });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
