const orders = new Map();

export function createOrder(data) {
	const orderId = data.orderId || `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
	const record = { id: orderId, createdAt: new Date().toISOString(), ...data };
	orders.set(orderId, record);
	return record;
}

export function getOrder(orderId) {
	return orders.get(orderId) || null;
}

export function upsertOrder(orderId, data) {
	const prev = orders.get(orderId);
	if (!prev) return createOrder({ orderId, ...data });
	const next = { ...prev, ...data };
	orders.set(orderId, next);
	return next;
}

