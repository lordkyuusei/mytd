/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** login.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = express.Router();
login.post("/login", (req, res) => {
	const { username, password } = req.body;
	const db = new sqlite3.Database("./db/mytd.db");

	// We check if the username is not already used, since we will use it as a unique identifier.
	db.get("SELECT username, password FROM accounts WHERE username = ?", username, (err, account) => {
		const isExisting = account !== undefined;
		const isMatching = isExisting && bcrypt.compareSync(password, account.password);
		const toRender = isExisting ? (isMatching ? "200" : "400") : "400";

		const accessToken = isMatching ? jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), id: account.id }, "superawesomekey") : undefined;
		const bearer = isMatching ? "Bearer" : undefined;
		const idToken = isMatching ? jwt.sign({ sub: account.id, preferred_username: account.username} , "superawesomekey") : undefined;
		const toSend = isMatching ? { accessToken, bearer, idToken } : "Bad request: Invalid credentials";

		res.status(toRender).send(toSend);
	});
});

export default login;