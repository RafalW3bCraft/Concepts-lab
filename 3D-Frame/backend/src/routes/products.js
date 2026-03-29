import express from "express";
import { PRODUCTS } from "./../sample-data/products.js";

const router = express.Router();

router.get("/", (_req, res) => {
	res.json({ products: PRODUCTS });
});

export default router;

