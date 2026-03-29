import React from "react";
import { Link } from "react-router-dom";

export default function HeroLanding() {
	return (
		<>
			{/* Hero Section */}
			<section className="hero" id="home">
				<div className="hero-content">
					<p className="mono-label">&gt; SYSTEM ALIVE // BATCH 042</p>
					<h1 className="hero-title">Precision<br />meets organic.</h1>
					<p className="hero-subtitle">
						The first AI-curated, precision-roasted coffee beans, packaged in a perfect 6x6x6 cube.
					</p>
					<Link to="/products" className="cta-primary" style={{ display: 'inline-block' }}>
						Explore Roasts
					</Link>
				</div>
				
				{/* SPLINE 3D COMPONENT PLACEHOLDER */}
				<div className="spline-placeholder-wrapper" id="spline-container">
					<div className="spline-placeholder-content">
						<span className="mono-label" style={{ opacity: 0.5 }}>[ SPLINE 3D COMPONENT SPACE ]</span>
						<p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
							Integrate your <br />Spline scene here
						</p>
					</div>
				</div>
			</section>

			{/* Services Section (Agency / Process) */}
			<section className="services section-padding" id="services">
				<div className="section-header">
					<span className="mono-label">01 // THE ARCHITECTURE</span>
					<h2>Smarter Selection. Better Brews.</h2>
				</div>
				<div className="services-grid">
					<div className="service-card glass-panel">
						<h3>Generative Profiles</h3>
						<p>Our AI curates roasting parameters based on global atmospheric conditions to bring out peak flavor notes.</p>
					</div>
					<div className="service-card glass-panel">
						<h3>3D X-Ray Vision</h3>
						<p>Hover over our packaging to inspect the beans inside. Absolute transparency in everything we do.</p>
					</div>
					<div className="service-card glass-panel">
						<h3>Headless & Secure</h3>
						<p>Built with next-gen frameworks, ensuring blazing-fast, ultra-secure checkout flows for founders and creators.</p>
					</div>
				</div>
			</section>
		</>
	);
}
