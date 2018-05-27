/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/
import sqlite3 from "sqlite3";
import express from "express";
import sessHandle, { setSession } from "../index";

const dashboard = express.Router();
dashboard.get("/dashboard", (req, res, err) => {
	setSession(req.session);
	const toRender = sessHandle.username === undefined ? "/?reason=login" : "dashboard.hbs";
	const doRender = sessHandle.username !== undefined;
	const whoRender = req.query.people !== undefined ? req.query.people : sessHandle.username;
	const db = doRender ? new sqlite3.Database("./db/mytd.db") : undefined;

	db !== undefined ? db.all("SELECT username, city FROM accounts", (err, allAccounts) => {
		db.close();
		const dbActivities = new sqlite3.Database("./db/mytd.db");

		dbActivities.all("SELECT * FROM activities WHERE username = ? ORDER BY date(ddate) ASC", whoRender, (err, activities) => {
			dbActivities.close();

			const dbWeights = new sqlite3.Database("./db/mytd.db");
			dbWeights.all("SELECT * FROM weights WHERE username = ? ORDER BY date(ddate) ASC", whoRender, (err, weights) => {
				dbWeights.close();
				res.render(toRender, { accs: allAccounts, acts: activities, weights: weights });
			});
		});
	}) : res.redirect(toRender);
});

dashboard.post("/dashboard", (req, res, err) => {
	setSession(req.session);
	const toRender = sessHandle.username === undefined ? "/?reason=login" : "dashboard.hbs";
	const doRender = sessHandle.username !== undefined;
	const toParse = req.body;
	const data = toParse.weight === undefined ? "activities" : "weights";
	const marks = toParse.weight === undefined ? "NULL,?,?,?,?,?,?" : "NULL,?,?,?,?";
	const query = toParse.weight === undefined ?
		[ sessHandle.username, toParse.datepick, new Date(toParse.datepick), toParse.begintime, toParse.endtime, toParse.desc ] : 
		[ sessHandle.username, toParse.datepick, new Date(toParse.datepick), toParse.weight ];

	const db = doRender ? new sqlite3.Database("./db/mytd.db") : undefined;
	db !== undefined ? db.run(`INSERT INTO ${data} VALUES(${marks})`, query, () => {
		db.close();
		res.redirect("/dashboard");
	}) : res.redirect(toRender);

});

export default dashboard;