/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** login.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import bcrypt from "bcrypt";
import { db, openDb, closeDb } from "../db/database.js";

const login = express.Router();

login.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (req.session.userId)
		res.redirect("/");
	
	if (db === undefined) {
		openDb();
	}
//	const db = new sqlite3.Database("./db/mytd.db");

	db.get("SELECT id, username, password FROM accounts WHERE username = ?", username, (err, account) => {
		const isExisting = account !== undefined;
		const isMatching = isExisting && bcrypt.compareSync(password, account.password);
		const toRender = isExisting ? (isMatching ? "dashboard" : "?reason=unmatch") : "?reason=nonexistent";

		req.session.userId = isMatching ? account.id : undefined;
		req.session.username = isMatching ? account.username : undefined;
		res.redirect(`/${toRender}`);
	});
});

login.post("/signout", (req, res) => {
	const toRender = req.session.username === undefined ? "/?reason=login" : "/";
	const doRender = req.session.username !== undefined;

	doRender ? req.session.destroy(() => {
		res.redirect(toRender);
		closeDb();
	}) : res.redirect(toRender);
});
export default login;