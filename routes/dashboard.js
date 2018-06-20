/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import { db } from "../db/database.js";

const dashboard = express.Router();
dashboard.get("/dashboard", (req, res) => {
	const doRender = req.session.userId !== undefined;
	const toRender = doRender ? "dashboard.hbs" : "/?reason=login";
	const whoRender = req.query.people !== undefined ? req.query.people : req.session.userId;

	db !== undefined ? db.all("SELECT id, username, born, city FROM accounts", (err, allAccounts) => {
		db.all("SELECT * FROM activities WHERE userid = ? ORDER BY date(ddate) ASC", whoRender, (err, activities) => {
			db.all("SELECT * FROM weights WHERE userid = ? ORDER BY date(ddate) ASC", whoRender, (err, weights) => {

				// Empty objects > undefined objects
				weights = weights === undefined || weights == null ? {} : weights;
				activities = activities === undefined || activities == null ? {} : activities;

				res.render(toRender, { accs: allAccounts, acts: activities, weights: weights });
			});
		});
	}) : res.redirect(toRender);
});

dashboard.post("/dashboard", (req, res) => {
	const doRender = req.session.userId !== undefined;
	const toRender = doRender ? "/dashboard" : "/?reason=login";

	// We only build one endpoint for the queries, since they are very similar and can be simplified by only a few lines of ternary code instead of two endpoints and code duplication.
	const data = req.body.weight === undefined ? "activities" : "weights";
	const marks = req.body.weight === undefined ? "NULL,?,?,?,?,?,?" : "NULL,?,?,?,?";
	const query = req.body.weight === undefined ?
		[ req.session.userId, req.body.datepick.replace(",", ""), new Date(req.body.datepick), req.body.begintime, req.body.endtime, req.body.desc ] : 
		[ req.session.userId, req.body.datepick.replace(",", ""), new Date(req.body.datepick), req.body.weight ];

	db !== undefined ? db.run(`INSERT INTO ${data} VALUES(${marks})`, query, () => {
		res.redirect(toRender);
	}) : res.redirect(toRender);
});

export default dashboard;