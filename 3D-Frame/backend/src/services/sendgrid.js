import sgMail from "@sendgrid/mail";

function isSendgridConfigured() {
	return Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
}

export async function sendOrderConfirmationEmail({ toEmail, name, orderId, productName, awb }) {
	if (!isSendgridConfigured()) {
		console.warn("[sendgrid] Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL; skipping email send.");
		return { status: "skipped" };
	}

	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const from = process.env.SENDGRID_FROM_EMAIL;
	const subject = `Order confirmation: ${orderId}`;
	const safeName = name || "Customer";
	const safeProduct = productName || "Coffee pack";
	const safeAwb = awb || "TBD";

	const text = [
		`Hi ${safeName},`,
		"",
		"Thanks for your order!",
		`Order ID: ${orderId}`,
		`Product: ${safeProduct}`,
		`Shipping AWB: ${safeAwb}`,
		"",
		"Warm regards,",
		"ORIGIN Coffee",
	].join("\n");

	await sgMail.send({
		to: toEmail,
		from,
		subject,
		text,
	});

	return { status: "sent" };
}

