import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RECIPES, recipeToProductId } from "../data/recipes.js";
import { PRODUCTS } from "../data/products.js";

export default function Recipes() {
	const navigate = useNavigate();
	const recipeSteps = useMemo(() => RECIPES, []);

	const [stepIndex, setStepIndex] = useState(0);
	const [answers, setAnswers] = useState({});

	const current = recipeSteps[stepIndex];
	const isLast = stepIndex >= recipeSteps.length;

	const recommendedId = recipeToProductId(answers);
	const recommended = useMemo(() => {
		if (!recommendedId) return null;
		return PRODUCTS.find((p) => p.id === recommendedId) ?? null;
	}, [recommendedId]);

	const handleNext = () => {
		setStepIndex((i) => i + 1);
	};

	return (
		<section className="finder section-padding" id="finder" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
			<div className="finder-container glass-panel" style={{ width: '100%' }}>
				<div className="finder-content">
					<span className="mono-label">03 // AI CONCIERGE</span>
					<h2>Find Your Perfect Pour</h2>
					<p>Let our AI digital barista analyze your brewing habits and palate to recommend the ideal 6x6x6 pack.</p>
					
					<div className="quiz-ui" style={{ minHeight: '200px' }}>
						{!isLast && current && (
							<>
								<label className="mono-detail">&gt; {current.title}</label>
								<div className="quiz-options">
									{current.choices.map((choice) => (
										<button 
											key={choice.value}
											onClick={() => setAnswers((prev) => ({ ...prev, [current.key]: choice.value }))}
											className={`quiz-btn ${answers[current.key] === choice.value ? "active" : ""}`}
										>
											{choice.label}
										</button>
									))}
								</div>
								
								<button 
									className="cta-secondary" 
									onClick={handleNext}
									disabled={!answers[current.key]}
									style={{ opacity: answers[current.key] ? 1 : 0.5, pointerEvents: answers[current.key] ? 'auto' : 'none' }}
								>
									Next Step
								</button>
							</>
						)}

						{isLast && recommended && (
							<div style={{ animation: 'fadeIn 0.5s ease' }}>
								<label className="mono-detail">&gt; Match Found</label>
								<h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{recommended.name}</h3>
								<p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
									{recommended.roast.charAt(0).toUpperCase() + recommended.roast.slice(1)} Roast // {recommended.origin}
								</p>
								<button 
									className="cta-primary"
									onClick={() => navigate(`/checkout?productId=${recommendedId}`)}
								>
									Checkout Pick
								</button>
								<button
									className="cta-secondary"
									onClick={() => { setStepIndex(0); setAnswers({}); }}
									style={{ marginLeft: '1rem' }}
								>
									Restart
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="finder-visual-placeholder">
					<span className="mono-label" style={{ opacity: 0.5 }}>[ Dynamic 3D Environment ]</span>
					<p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
						Reactionary background based on<br />user selection
					</p>
				</div>
			</div>
		</section>
	);
}
