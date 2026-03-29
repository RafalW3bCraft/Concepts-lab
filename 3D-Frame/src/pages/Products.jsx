import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";

export default function Products() {
	const scrollRef = useRef(null);

	useEffect(() => {
		const handleWheel = (e) => {
			if (scrollRef.current && e.deltaY !== 0) {
				// Don't prevent default completely unless we're actually inside the horizontal scroll bounds
				// For a simple standalone page, we can convert Y to X natively:
				e.preventDefault();
				scrollRef.current.scrollLeft += e.deltaY;
			}
		};

		const el = scrollRef.current;
		if (el) {
			// use passive: false to allow preventDefault
			el.addEventListener("wheel", handleWheel, { passive: false });
		}

		return () => {
			if (el) {
				el.removeEventListener("wheel", handleWheel);
			}
		};
	}, []);

	return (
		<section className="gallery section-padding" id="roasts" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
			<div className="section-header">
				<span className="mono-label">02 // HORIZONTAL INDEX</span>
				<h2>Our Roasts</h2>
			</div>
			
			<div className="gallery-scroll-container" ref={scrollRef}>
				{PRODUCTS.map((product) => (
					<Link to={`/checkout?productId=${product.id}`} key={product.id} className="product-item glass-panel group">
						<div className="product-3d-placeholder">
							<span>[ 3D WebGL Canvas ]<br />6x6x6 Box Model</span>
						</div>
						<div className="product-info">
							<h3>{product.name}</h3>
							<p className="mono-detail">
								{product.roast.charAt(0).toUpperCase() + product.roast.slice(1)} Roast // {product.origin}
							</p>
							<p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
								{product.notes.join(" • ")}
							</p>
							<p className="mono-label" style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>
								${(product.price / 100).toFixed(2)}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
