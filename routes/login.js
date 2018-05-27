/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** login.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import sqlite3 from "sqlite3";
import sessHandle, { setSession } from "../index";
import bcrypt from "bcrypt";

const login = express.Router();
login.post("/login", (req, res) => {
	if (sessHandle.username)
		res.redirect("/");
	const { username, password } = req.body;
	const db = new sqlite3.Database("./db/mytd.db");

	// We check if the username is not already used, since we will use it as a unique identifier.
	db.get("SELECT username, password FROM accounts WHERE username = ?", username, (err, account) => {
		const isExisting = account !== undefined;
		const isMatching = isExisting && bcrypt.compareSync(password, account.password);
		const toRender = isExisting ? (
			isMatching ? "dashboard" : "?reason=unmatch"
		) : "?reason=nonexistent";

		setSession(req.session);
		sessHandle.username = isMatching ? username : undefined;
		res.redirect(`/${toRender}`);
	});
});

login.post("/signout", (req, res) => {
	setSession(req.session);
	const toRender = sessHandle.username === undefined ? "/?reason=login" : "/";
	const doRender = sessHandle.username !== undefined;

	doRender ? req.session.destroy(() => {
		sessHandle.username = undefined;
		res.redirect(toRender);
	}) : res.redirect(toRender);
});
export default login;