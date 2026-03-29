// Skeleton recipe-to-bean mapping via tags scoring.
export const RECIPES = [
	{
		key: "taste",
		title: "Pick your taste",
		choices: [
			{ value: "bold", label: "Bold & intense" },
			{ value: "creamy", label: "Creamy & cozy" },
			{ value: "sweet", label: "Sweet & smooth" },
			{ value: "light", label: "Light & refreshing" },
		],
	},
	{
		key: "aroma",
		title: "Choose an aroma",
		choices: [
			{ value: "chocolatey", label: "Chocolatey" },
			{ value: "nutty", label: "Nutty" },
			{ value: "caramel", label: "Caramel" },
			{ value: "smoky", label: "Smoky cocoa" },
		],
	},
	{
		key: "milk",
		title: "How do you love it?",
		choices: [
			{ value: "espresso", label: "Short & strong" },
			{ value: "latte", label: "Milk-forward latte" },
			{ value: "cappuccino", label: "Foamy cappuccino" },
			{ value: "coldbrew", label: "Iced cold brew" },
		],
	},
];

const TAGS_FOR_STEP = {
	taste: {
		bold: "bold",
		creamy: "creamy",
		sweet: "sweet",
		light: "light",
	},
	aroma: {
		chocolatey: "chocolatey",
		nutty: "nutty",
		caramel: "caramel",
		smoky: "smoky",
	},
	milk: {
		espresso: "espresso",
		latte: "latte",
		cappuccino: "cappuccino",
		coldbrew: "coldbrew",
	},
};

export function recipeToProductId(answers) {
	if (!answers) return null;

	// Skeleton UX: only recommend once all steps are answered.
	for (const step of RECIPES) {
		if (answers[step.key] === undefined) return null;
	}

	// Build desired tag list.
	const desiredTags = [];
	for (const step of RECIPES) {
		const val = answers[step.key];
		if (!val) continue;
		const tag = TAGS_FOR_STEP[step.key]?.[val];
		if (tag) desiredTags.push(tag);
	}

	// Score products by matching tags. Later we can move this to backend.
	// For skeleton: map to first best match by tag coverage.
	// NOTE: must align with PRODUCTS tags values.
	const candidates = [
		"espresso-velvet",
		"latte-almond",
		"cappuccino-nova",
		"coldbrew-mint",
		"aero-caramel",
		"mocha-nightshade",
	];

	const PRODUCT_TAGS = {
		"espresso-velvet": ["bold", "chocolatey", "espresso"],
		"latte-almond": ["creamy", "nutty", "latte"],
		"cappuccino-nova": ["balanced", "chocolatey", "cappuccino"],
		"coldbrew-mint": ["smooth", "light", "coldbrew"],
		"aero-caramel": ["sweet", "caramel", "aero"],
		"mocha-nightshade": ["bold", "smoky", "mocha"],
	};

	let best = null;
	let bestScore = -1;

	for (const id of candidates) {
		const tags = PRODUCT_TAGS[id] ?? [];
		const score = desiredTags.reduce((acc, dt) => acc + (tags.includes(dt) ? 1 : 0), 0);
		if (score > bestScore) {
			bestScore = score;
			best = id;
		}
	}

	// If no answers yet, default.
	if (bestScore <= 0) return candidates[0];
	return best;
}

