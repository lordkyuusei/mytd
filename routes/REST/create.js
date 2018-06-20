/***************************************
** O-rizon development
** Created by Kevin POIROT
** 20/05/18 - 16:45
** create.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import bcrypt from "bcrypt";
import { db, openDb } from "../db/database.js";

const create = express.Router();

create.post("/create", (req, res) => {
	const { username, password, datepick, city } = req.body;

	openDb();

	db.get("SELECT username FROM accounts WHERE username = ?", username, (err, account) => {
		const pass = account === undefined;
		const error = pass ? "" : `Bad Request: ${username} already used.`;

		pass ? bcrypt.hash(password, 10, (err, hash) => {
			db.run("INSERT INTO accounts VALUES(NULL,?,?,?,?)", username, hash, datepick, city);
			res.status("200").send("OK");
		}) : res.status("401").send(error);
	});
});

create.get("/create", (req, res) => {
	res.status("304").send("Redirected");
});

export default create;