/***************************************
** O-rizon development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** create.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import bcrypt from "bcrypt";
import { db, openDb } from "../db/database";

const create = express.Router();

create.post("/create", (req, res) => {
	const { username, password, datepick, city } = req.body;

	openDb();

	db.get("SELECT username FROM accounts WHERE username = ?", username, (err, account) => {
		const pass = account === undefined;
		const error = pass ? "" : "alreadyused";

		pass ? bcrypt.hash(password, 10, (err, hash) => {
			db.run("INSERT INTO accounts VALUES(NULL,?,?,?,?)", username, hash, datepick, city);
			db.get("SELECT id from accounts WHERE username = ?", username, (err, accountNbr) => {
				req.session.userId = accountNbr.id === undefined ? accountNbr : accountNbr.id;
				req.session.username = username;
				req.session.save(() => {
					res.redirect("/dashboard");
				});
			});
		}) : res.redirect(`/?reason=${error}`);
	});
});

create.get("/create", (req, res) => {
	res.render("error.hbs", { title: "Redirected"});
});

export default create;