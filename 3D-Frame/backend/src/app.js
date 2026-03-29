import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import checkoutRouter from "./routes/checkout.js";
import orderRouter from "./routes/order.js";
import shiprocketRouter from "./routes/shiprocket.js";

dotenv.config();

export function createApp() {
	const app = express();

	app.use(cors());
	app.use(express.json({ limit: "1mb" }));

	app.get("/api/health", (_req, res) => {
		res.json({ ok: true, service: "coffee-shop-backend" });
	});

	app.use("/api/products", productsRouter);
	app.use("/api/checkout", checkoutRouter);
	app.use("/api/order", orderRouter);
	app.use("/api/shiprocket", shiprocketRouter);

	// Basic error handler to keep JSON shape stable.
	// eslint-disable-next-line no-unused-vars
	app.use((err, _req, res, _next) => {
		console.error("[backend] Unhandled error:", err);
		res.status(500).json({
			code: "INTERNAL_ERROR",
			message: "Unexpected server error",
		});
	});

	return app;
}

