let razorpayScriptPromise = null;

export function loadRazorpayCheckoutScript() {
	// If already loaded, resolve immediately.
	if (typeof window !== "undefined" && window.Razorpay) {
		return Promise.resolve(window.Razorpay);
	}

	if (razorpayScriptPromise) return razorpayScriptPromise;

	razorpayScriptPromise = new Promise((resolve, reject) => {
		const existing = document.querySelector('script[data-razorpay="checkout"]');
		if (existing) {
			existing.addEventListener("load", () => resolve(window.Razorpay));
			existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay script")));
			return;
		}

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.dataset.razorpay = "checkout";
		script.onload = () => {
			if (!window.Razorpay) {
				reject(new Error("Razorpay loaded but window.Razorpay is missing"));
				return;
			}
			resolve(window.Razorpay);
		};
		script.onerror = () => reject(new Error("Failed to load Razorpay script"));
		document.head.appendChild(script);
	});

	return razorpayScriptPromise;
}

