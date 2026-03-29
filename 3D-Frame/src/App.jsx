import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import HeroLanding from "./pages/HeroLanding.jsx";
import Products from "./pages/Products.jsx";
import Recipes from "./pages/Recipes.jsx";
import Checkout from "./pages/Checkout.jsx";

function TopNav() {
	const { pathname } = useLocation();
	return (
		<nav className="navbar">
			<Link to="/" className="logo">
				<span className="logo-sans">TENBIN</span>
				<span className="logo-mono">_ai</span>
			</Link>
			<ul className="nav-links">
				<li><Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
				<li><Link to="/products" className={pathname === "/products" ? "active" : ""}>Catalog</Link></li>
				<li><Link to="/recipes" className={pathname === "/recipes" ? "active" : ""}>AI Concierge</Link></li>
			</ul>
			<Link to="/checkout" className="cart-btn" style={{ textDecoration: 'none' }}>Cart [0]</Link>
		</nav>
	);
}

function CustomCursor() {
	useEffect(() => {
		const cursor = document.getElementById("custom-cursor");
		if (!cursor) return;

		const moveCursor = (e) => {
			cursor.style.left = e.clientX + "px";
			cursor.style.top = e.clientY + "px";
		};

		const handleMouseOver = (e) => {
			if (e.target.closest('a, button, .service-card, .product-item')) {
				cursor.classList.add("hovering");
			}
		};
		const handleMouseOut = (e) => {
			if (e.target.closest('a, button, .service-card, .product-item')) {
				cursor.classList.remove("hovering");
			}
		};

		document.addEventListener("mousemove", moveCursor);
		document.addEventListener("mouseover", handleMouseOver);
		document.addEventListener("mouseout", handleMouseOut);

		return () => {
			document.removeEventListener("mousemove", moveCursor);
			document.removeEventListener("mouseover", handleMouseOver);
			document.removeEventListener("mouseout", handleMouseOut);
		};
	}, []);

	return <div className="cursor" id="custom-cursor"></div>;
}

export default function App() {
	return (
		<div className="appRoot">
			<CustomCursor />
			<TopNav />
			<main className="smooth-scroll-wrapper">
				<Routes>
					<Route path="/" element={<HeroLanding />} />
					<Route path="/products" element={<Products />} />
					<Route path="/recipes" element={<Recipes />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</div>
	);
}
