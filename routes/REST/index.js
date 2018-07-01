/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/

import express from "express";
const routes = express.Router();

routes.get("/", (req, res) => {
	// No useful information for smart devices here.
	res.status("200").send("Please send a request to /api/login to login.");
});

export default routes;