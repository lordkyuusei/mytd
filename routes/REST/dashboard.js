/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/
import express from "express";
import jwt from "jsonwebtoken";
import { db, openDb } from "../../db/database.js";

const dashboard = express.Router();
dashboard.get("/dashboard", (req, res) => {
	const headers = req.headers;
	const toRender = headers === undefined || headers.authorization === undefined ? "401" : "200";
	const doRender = toRender !== "401";
	const token = doRender ? headers.authorization : undefined;

	let jwtResult = undefined;

	try {
		jwtResult = doRender ? jwt.verify(token, "superawesomekey") : "Bad request : session not valid";
	} catch(JsonWebTokenError) {
		res.status(toRender).send("Bad authtication token.");
	}

	if (doRender && jwtResult !== undefined) {
		openDb();
		const whoRender = req.query.people !== undefined ? req.query.people : jwtResult.sub;
		db.all("SELECT id, username, born, city FROM accounts", (err, allAccounts) => {
			db.all("SELECT * FROM activities WHERE userid = ? ORDER BY date(ddate) ASC", whoRender, (err, activities) => {
				db.all("SELECT * FROM weights WHERE userid = ? ORDER BY date(ddate) ASC", whoRender, (err, weights) => {
					db.close();
					// Empty objects > undefined objects
					weights = weights === undefined || weights == null ? {} : weights;
					activities = activities === undefined || activities == null ? {} : activities;
	
					res.status(toRender).send( { accs: allAccounts, acts: activities, weights: weights });
				});
			});
		});
	}
	else
		res.status(toRender).send(jwtResult);
});

dashboard.post("/dashboard", (req, res) => {
	const headers = req.headers;
	const toRender = headers === undefined || headers.authorization === undefined ? "401" : "200";
	const doRender = toRender !== "401";
	const token = doRender ? headers.authorization : undefined;
	const data = req.body.weight === undefined ? "activities" : "weights";
	const marks = req.body.weight === undefined ? "NULL,?,?,?,?,?,?" : "NULL,?,?,?,?";

	let jwtResult;

	try {
		jwtResult = doRender ? jwt.verify(token, "superawesomekey") : "Bad request : session not valid";
	} catch(JsonWebTokenError) {
		res.status(toRender).send("Bad authtication token.");
	}

	const query = req.body.weight === undefined ?
		[ jwtResult.sub, req.body.datepick.replace(",", ""), new Date(req.body.datepick), req.body.begintime, req.body.endtime, req.body.desc ] : 
		[ jwtResult.sub, req.body.datepick.replace(",", ""), new Date(req.body.datepick), req.body.weight ];

	if (doRender && jwtResult !== undefined) {
		openDb();
		db.run(`INSERT INTO ${data} VALUES(${marks})`, query, () => {
			db.close();
			res.status(toRender).send("OK");
		});
	}
	else
		res.status(toRender).send("Error: Bad Request.");
});

export default dashboard;