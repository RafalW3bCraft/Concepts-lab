import Razorpay from "razorpay";

export async function createRazorpayOrder({
	productId,
	amount,
	currency = "INR",
	receipt,
}) {
	const keyId = process.env.RAZORPAY_KEY_ID;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;

	if (!keyId || !keySecret) {
		// Skeleton fallback.
		return {
			razorpayOrderId: `mock_order_${Date.now()}`,
			amount,
			currency,
			keyId: keyId || "RAZORPAY_KEY_ID_MISSING",
		};
	}

	const razorpay = new Razorpay({
		key_id: keyId,
		key_secret: keySecret,
	});

	const notes = { productId };

	const order = await razorpay.orders.create({
		amount,
		currency,
		receipt: receipt || `rcpt_${productId}_${Date.now()}`,
		notes,
		payment_capture: 1,
	});

	return {
		razorpayOrderId: order.id,
		amount: order.amount,
		currency: order.currency,
		keyId,
	};
}

