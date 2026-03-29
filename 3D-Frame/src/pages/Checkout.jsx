import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { loadRazorpayCheckoutScript } from "../lib/razorpay.js";

function getQueryParam(search, key) {
	const params = new URLSearchParams(search);
	return params.get(key);
}

export default function Checkout() {
	const navigate = useNavigate();
	const location = useLocation();
	const productId = getQueryParam(location.search, "productId");
	const products = useMemo(() => PRODUCTS, []);
	const product = products.find((p) => p.id === productId) ?? products[0];

	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [confirmation, setConfirmation] = useState(null);

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

	function apiUrl(path) {
		return `${API_BASE_URL}${path}`;
	}

	async function postJson(path, body) {
		const res = await fetch(apiUrl(path), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		let data = null;
		try {
			data = await res.json();
		} catch {
			// ignore
		}
		if (!res.ok) {
			throw new Error(data?.message || `Request failed: ${res.status}`);
		}
		return data;
	}

	useEffect(() => {
		setError(null);
		setConfirmation(null);
	}, [productId]);

	async function submitPayment() {
		if (!product) return;
		setSubmitting(true);
		setError(null);

		let modalOpened = false;

		try {
			const amount = product.price * 100; // IN-V0 skeleton: paise
			const currency = "INR";
			const receipt = `rcpt_${product.id}_${Date.now()}`;

			// Basic required fields for skeleton.
			if (!form.name || !form.email || !form.phone || !form.address) {
				throw new Error("Please fill all shipping fields.");
			}

			const checkout = await postJson("/api/checkout", {
				productId: product.id,
				amount,
				currency,
				receipt,
			});

			const razorpayConfigured =
				checkout?.keyId && !String(checkout.keyId).includes("MISSING") && checkout?.razorpayOrderId;

			const shipping = {
				name: form.name,
				email: form.email,
				phone: form.phone,
				address: form.address,
			};

			if (!razorpayConfigured) {
				// Skeleton fallback: exercise backend order + shiprocket.
				const paymentId = `mock_payment_${Date.now()}`;
				const order = await postJson("/api/order", {
					razorpayOrderId: checkout?.razorpayOrderId || "mock_order",
					razorpayPaymentId: paymentId,
					productId: product.id,
					customer: { name: form.name, email: form.email, phone: form.phone },
					shipping,
					amount,
					currency,
				});

				const shipment = await postJson("/api/shiprocket", {
					orderId: order.orderId,
					shipping,
					amount,
					currency,
					testMode: true,
				});

				setConfirmation({
					orderId: order.orderId,
					paymentStatus: "paid",
					paymentId,
					product: { id: product.id, name: product.name },
					awb: shipment.awb,
					shipmentId: shipment.shipmentId,
				});
				setSubmitting(false);
				return;
			}

			await loadRazorpayCheckoutScript();

			const paidRef = { paid: false };
			const RazorpayCtor = window.Razorpay;
			const razorpayOptions = {
				key: checkout.keyId,
				amount: checkout.amount,
				currency: checkout.currency,
				name: "TENBIN AI Coffee",
				description: `Coffee pack: ${product.name}`,
				order_id: checkout.razorpayOrderId,
				prefill: { name: form.name, email: form.email, contact: form.phone },
				theme: { color: "#ffffff" },
				handler: async function (response) {
					try {
						paidRef.paid = true;
						const paymentId = response.razorpay_payment_id;
						const order = await postJson("/api/order", {
							razorpayOrderId: checkout.razorpayOrderId,
							razorpayPaymentId: paymentId,
							productId: product.id,
							customer: { name: form.name, email: form.email, phone: form.phone },
							shipping,
							amount,
							currency,
						});

						const shipment = await postJson("/api/shiprocket", {
							orderId: order.orderId,
							shipping,
							amount,
							currency,
							testMode: true,
						});

						setConfirmation({
							orderId: order.orderId,
							paymentStatus: "paid",
							paymentId,
							product: { id: product.id, name: product.name },
							awb: shipment.awb,
							shipmentId: shipment.shipmentId,
						});
					} catch (e) {
						console.error(e);
						setError("Payment succeeded but post-payment processing failed.");
					} finally {
						setSubmitting(false);
					}
				},
				modal: {
					ondismiss: function () {
						if (!paidRef.paid) {
							setSubmitting(false);
							setError("Payment cancelled.");
						}
					},
				},
			};

			const rzp = new RazorpayCtor(razorpayOptions);
			modalOpened = true;
			rzp.open();
		} catch (e) {
			console.error(e);
			setError(e?.message || "Checkout failed.");
			setSubmitting(false);
		}
	}

	const inputStyle = {
		width: "100%",
		padding: "0.75rem",
		background: "rgba(255,255,255,0.05)",
		border: "1px solid var(--glass-border)",
		borderRadius: "4px",
		color: "white",
		fontFamily: "var(--font-sans)",
		fontSize: "1rem",
		outline: "none",
		marginBottom: "1rem"
	};

	if (confirmation) {
		return (
			<section className="section-padding" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
				<div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
					<span className="mono-label">SECURE // ORDER CONFIRMED</span>
					<h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Deployment successful.</h2>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
						<div>
							<div className="mono-label">Payment ID</div>
							<div style={{ fontFamily: 'var(--font-mono)' }}>{confirmation.paymentId} [{confirmation.paymentStatus}]</div>
						</div>
						<div>
							<div className="mono-label">Order ID</div>
							<div style={{ fontFamily: 'var(--font-mono)' }}>{confirmation.orderId}</div>
						</div>
						<div>
							<div className="mono-label">Shipping AWB</div>
							<div style={{ fontFamily: 'var(--font-mono)' }}>{confirmation.awb}</div>
						</div>
					</div>

					<div className="mono-detail" style={{ marginBottom: '2rem' }}>
						Target Payload: {confirmation.product.name}
					</div>
					<button className="cta-primary" onClick={() => navigate("/products")}>
						Return to Index
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="section-padding" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
			<div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
				<span className="mono-label">SECURE CHECKOUT // ENCRYPTED</span>
				<h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Finalize Order</h2>
				<p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
					Secure headless transaction for your {product?.name} ({product?.price ? `$${(product.price / 100).toFixed(2)}` : ''}).
				</p>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
					<input
						style={inputStyle}
						value={form.name}
						onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
						placeholder="Receptor Name"
						autoComplete="name"
					/>
					<input
						style={inputStyle}
						value={form.email}
						onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
						placeholder="Secure Link (Email)"
						autoComplete="email"
					/>
				</div>
				<input
					style={inputStyle}
					value={form.phone}
					onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
					placeholder="Comm Link (+...)"
					autoComplete="tel"
				/>
				<textarea
					style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
					value={form.address}
					onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
					placeholder="Deployment Coordinates (Address)"
				/>

				<button
					className="cta-primary"
					style={{ width: "100%", marginTop: "1rem", textAlign: "center" }}
					onClick={submitPayment}
					disabled={submitting}
				>
					{submitting ? "Processing..." : "Deploy via Razorpay"}
				</button>
				
				{error && <div style={{ marginTop: '1rem', color: '#ff6b6b', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>[ERROR] {error}</div>}
			</div>
		</section>
	);
}
