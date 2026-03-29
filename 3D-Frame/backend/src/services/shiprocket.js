import axios from "axios";

function isShiprocketConfigured() {
	return Boolean(
		process.env.SHIPROCKET_EMAIL &&
			process.env.SHIPROCKET_PASSWORD &&
			process.env.SHIPROCKET_PICKUP_ID,
	);
}

export async function createShipment({ orderId, shipping, amount, currency, testMode = true }) {
	const pickupId = process.env.SHIPROCKET_PICKUP_ID;
	const baseUrl = process.env.SHIPROCKET_BASE_URL || "https://apiv.shiprocket.in";

	const loginUrl =
		process.env.SHIPROCKET_LOGIN_URL || `${baseUrl}/v1/external/auth/login`;

	// Skeleton-friendly: allow overriding the shipment create URL if needed.
	const shipmentUrl =
		process.env.SHIPROCKET_SHIPMENT_URL ||
		`${baseUrl}/v1/external/courier/shipments`;

	const payload = {
		order_id: orderId,
		amount,
		currency,
		testMode,
		pickup_id: pickupId,
		// Shiprocket expects a very specific schema; for now we pass through shipping object.
		shipping: shipping || {},
	};

	if (!isShiprocketConfigured()) {
		const awb = `MOCK-AWB-${Math.floor(Math.random() * 1000000)}`;
		console.warn("[shiprocket] Credentials missing; returning mocked AWB.", { awb, orderId });
		return { awb, shipmentId: null, payload, mocked: true };
	}

	try {
		// 1) Auth
		const loginRes = await axios.post(
			loginUrl,
			{
				email: process.env.SHIPROCKET_EMAIL,
				password: process.env.SHIPROCKET_PASSWORD,
			},
			{ timeout: 20000 },
		);

		const token = loginRes.data?.token || loginRes.data?.data?.token;
		if (!token) throw new Error("Shiprocket auth token missing");

		// 2) Create shipment
		const shipmentRes = await axios.post(shipmentUrl, payload, {
			timeout: 25000,
			headers: { Authorization: `Bearer ${token}` },
		});

		// Attempt to find an AWB field in common shapes; otherwise fall back.
		const awb =
			shipmentRes.data?.awb ||
			shipmentRes.data?.data?.awb ||
			shipmentRes.data?.shipment_id ||
			`AWB-${Math.floor(Math.random() * 1000000)}`;

		return { awb, shipmentId: shipmentRes.data?.shipment_id || null, payload, mocked: false };
	} catch (err) {
		console.error("[shiprocket] Shipment creation failed, returning mock:", err?.message || err);
		const awb = `MOCK-AWB-${Math.floor(Math.random() * 1000000)}`;
		return { awb, shipmentId: null, payload, mocked: true, error: String(err?.message || err) };
	}
}

