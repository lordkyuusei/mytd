/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 12:13
** index.js
** 2018 - All rights reserved
***************************************/
import sqlite3 from "sqlite3";
import express from "express";
import jwt from "jsonwebtoken";

const dashboard = express.Router();
dashboard.get("/dashboard", (req, res, err) => {
	const { postId } = req.body;
	const headers = req.headers;
	const toRender = headers === undefined || headers.authorization === undefined ? "401" : "200";
	const doRender = toRender !== "401";
	const tokens = doRender ? headers.authorization.split(" ") : undefined;
	const token = doRender ? tokens[1] : "undefined";

	const id = jwt.verify(token, "superawesomekey");
	const render = postId === id ? "200" : "401";
	const text = postId === id ? "OK" : "Bad Request: invalid token";
	res.status(render).send(text);

/*	const whoRender = req.query.people !== undefined ? req.query.people : sessHandle.username;
	const db = doRender ? new sqlite3.Database("./db/mytd.db") : undefined;
	db !== undefined ? db.all("SELECT username, city FROM accounts", (err, allAccounts) => {
		db.close();
		const dbb = new sqlite3.Database("./db/mytd.db");
		dbb.all(`SELECT * FROM activities WHERE username="${whoRender}" ORDER BY date(ddate) ASC`, (err, activities) => {
			dbb.close();
			const dbbb = new sqlite3.Database("./db/mytd.db");
			dbbb.all(`SELECT * FROM weights WHERE username="${whoRender}" ORDER BY date(ddate) ASC`, (err, weights) => {
				dbbb.close();

				// Le code en cascade, c'est le nec le plus ultra
				res.render(toRender, { accs: allAccounts, acts: activities, weights: weights });
			});
		});
	}) : res.redirect(toRender);*/
});

dashboard.post("/dashboard", (req, res, err) => {
	setSession(req.session);
	const toRender = sessHandle.username === undefined ? "/?reason=login" : "dashboard.hbs";
	const doRender = sessHandle.username !== undefined;
	const toParse = req.body;
	const query = toParse.weight === undefined ?
		`INSERT INTO activities VALUES(NULL, "${sessHandle.username}", "${toParse.datepick}", "${new Date(toParse.datepick)}", "${toParse.begintime}", "${toParse.endtime}", "${toParse.desc}")` : 
		`INSERT INTO weights VALUES(NULL, "${sessHandle.username}", "${toParse.datepick}", "${new Date(toParse.datepick)}", "${toParse.weight}")`;

	const db = doRender ? new sqlite3.Database("./db/mytd.db") : undefined;
	db !== undefined ? db.all(query, () => {
		db.close();
		res.redirect("/dashboard");
	}) : res.redirect(toRender);

});

export default dashboard;