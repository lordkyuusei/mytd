/***************************************
** O-rizon development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** create.js
** 2018 - All rights reserved
***************************************/

import sqlite3 from "sqlite3";
import express from "express";
import bcrypt from "bcrypt";
import sessHandle, { setSession } from "../index";

const create = express.Router();

create.post("/create", (req, res) => {
	const { username, password, datepick, city } = req.body;
	const db = new sqlite3.Database("./db/mytd.db");

	// We check if the username is not already used, since we will use it as a unique identifier.
	db.get("SELECT username FROM accounts WHERE username = ?", username, (err, account) => {
		const pass = account === undefined;
		const error = pass ? "" : "alreadyused";

		pass ? bcrypt.hash(password, 10, (err, hash) => {
			db.run("INSERT INTO accounts VALUES(NULL,?,?,?,?)", username, hash, datepick, city);
			db.close();

			// If we manage to get there, then the subscription is valid, so we just login the user as well.
			setSession(req.session);
			sessHandle.username = username;
			res.redirect("/dashboard");
		}) : res.redirect(`/?reason=${error}`);
	});
});

create.get("/create", (req, res) => {
	res.render("error.hbs", { title: "Redirected"});
});

export default create;