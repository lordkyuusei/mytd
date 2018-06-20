/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/

import express from "express";

const routes = express.Router();
const getErrorFromList = (key, src) => {
	let error = "";
	src.map((elem) => {
		if (elem[0] === key) {
			error = elem[1];
		}
	});
	return error;
};

routes.get("/", (req, res) => {
	const errors = [["login", "You must be logged in to access this page."],["unmatch", "The informations you provided does not match. Try again."],["nonexistent", "The informations you provided does not exist. Try again."], ["alreadyused", "Error: username already used."]];
	const error = req.query.reason !== undefined ? getErrorFromList(req.query.reason, errors) : "";
	const toRender = req.session.userId === undefined ? "main.hbs" : "dashboard.hbs";
	res.render(toRender, { title: "Welcome to MyTD !", error: error });
});

export default routes;