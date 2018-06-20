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
import { db } from "../../db/database.js";

const dashboard = express.Router();
dashboard.get("/dashboard", (req, res) => {
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
});

dashboard.post("/dashboard", (req, res) => {
	res.status("200").send("Valid request but not yet implemented.");
});

export default dashboard;