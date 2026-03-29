import express from "express";
import { getOrder, upsertOrder } from "../storage/orderStore.js";
import { createShipment } from "../services/shiprocket.js";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { orderId, shipping, amount, currency, testMode = true } = req.body || {};
		if (!orderId) {
			return res.status(400).json({ code: "INVALID_INPUT", message: "orderId is required" });
		}

		const order = getOrder(orderId);
		if (!order) {
			return res.status(404).json({ code: "NOT_FOUND", message: "Unknown orderId" });
		}

		const shipment = await createShipment({
			orderId,
			shipping: shipping || order.shipping,
			amount: amount ?? order.amount,
			currency: currency ?? order.currency ?? "INR",
			testMode,
		});

		upsertOrder(orderId, {
			awb: shipment.awb,
			shipmentId: shipment.shipmentId,
			shippingPayload: shipment.payload,
			shippingStatus: shipment.mocked ? "mocked" : "created",
		});

		return res.json({ awb: shipment.awb, shipmentId: shipment.shipmentId, payload: shipment.payload });
	} catch (err) {
		console.error("[backend] /api/shiprocket error:", err);
		return res.status(500).json({ code: "SHIPROCKET_ERROR", message: "Failed to create shipment" });
	}
});

export default router;

