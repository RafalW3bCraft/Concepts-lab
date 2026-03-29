import express from "express";
import { PRODUCTS } from "./../sample-data/products.js";
import { createRazorpayOrder } from "../services/razorpay.js";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { productId, amount, currency = "INR", receipt } = req.body || {};
		if (!productId) {
			return res.status(400).json({ code: "INVALID_INPUT", message: "productId is required" });
		}

		const product = PRODUCTS.find((p) => p.id === productId);
		if (!product) {
			return res.status(404).json({ code: "NOT_FOUND", message: "Unknown productId" });
		}

		// Skeleton contract: treat `amount` as smallest currency units (paise) when provided.
		// If omitted, compute from product price (INR rupees -> paise).
		let finalAmount = amount;
		if (finalAmount === undefined || finalAmount === null) {
			finalAmount = currency === "INR" ? Math.round(product.price * 100) : product.price;
		}

		const order = await createRazorpayOrder({
			productId,
			amount: Math.round(finalAmount),
			currency,
			receipt,
		});

		return res.json(order);
	} catch (err) {
		console.error("[backend] /api/checkout error:", err);
		return res.status(500).json({ code: "CHECKOUT_ERROR", message: "Failed to initiate checkout" });
	}
});

export default router;

