import express from "express";
import { PRODUCTS } from "./../sample-data/products.js";
import { createOrder, upsertOrder, getOrder } from "../storage/orderStore.js";
import { sendOrderConfirmationEmail } from "../services/sendgrid.js";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const {
			razorpayOrderId,
			razorpayPaymentId,
			productId,
			customer,
			shipping,
			amount,
			currency,
			awb,
		} = req.body || {};

		if (!razorpayOrderId || !razorpayPaymentId || !productId) {
			return res.status(400).json({
				code: "INVALID_INPUT",
				message: "razorpayOrderId, razorpayPaymentId and productId are required",
			});
		}

		const product = PRODUCTS.find((p) => p.id === productId);
		const productName = product?.name || "Coffee pack";

		const orderId = razorpayOrderId.replace(/^order_/, "order_") + "_" + String(Date.now());

		const record = upsertOrder(orderId, {
			orderId,
			razorpayOrderId,
			razorpayPaymentId,
			productId,
			productName,
			customer: customer || {},
			shipping: shipping || {},
			amount,
			currency,
			awb: awb || null,
			paymentStatus: "paid",
		});

		const email = record.customer?.email;
		if (email) {
			await sendOrderConfirmationEmail({
				toEmail: email,
				name: record.customer?.name,
				orderId,
				productName,
				awb: record.awb || "TBD",
			});
		} else {
			console.warn("[sendgrid] customer.email missing; skipping email.");
		}

		return res.json({ orderId });
	} catch (err) {
		console.error("[backend] /api/order error:", err);
		return res.status(500).json({ code: "ORDER_ERROR", message: "Failed to store order" });
	}
});

export default router;

