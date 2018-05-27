/***************************************
** MyTD development
** Created by Kevin POIROT
** 20/05/18 - 11:59
** index.js
** 2018 - All rights reserved
***************************************/

import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import session from "express-session";
import Handlebars from "hbs";

/* routes */
import index from "./routes/index";
import login from "./routes/login";
import create from "./routes/create";
import dashboard from "./routes/dashboard";
import indexrest from "./routes/REST/index";
import loginrest from "./routes/REST/login";
import createrest from "./routes/REST/create";
import dashboardrest from "./routes/REST/dashboard";

/* database */
const db = new sqlite3.Database("./db/mytd.db");
db.run("CREATE TABLE IF NOT EXISTS accounts(id INTEGER,username STRING,password STRING,born STRING,city STRING, PRIMARY KEY (id));");
db.run("CREATE TABLE IF NOT EXISTS activities(id INTEGER,username STRING,date STRING, ddate STRING, start STRING,end STRING,desc STRING, PRIMARY KEY (id));");
db.run("CREATE TABLE IF NOT EXISTS weights(id INTEGER,username STRING,date STRING,ddate STRING,weight INTEGER, PRIMARY KEY (id));");
db.close();

/* config */
const app = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(express.static(path.join(__dirname, "public")));  
app.use(session({ secret: "d14m4nt68*" }));

app.use("/", create);
app.use("/", login);
app.use("/", index);
app.use("/", dashboard);
app.use("/api", createrest);
app.use("/api", loginrest);
app.use("/api", indexrest);
app.use("/api", dashboardrest);

let sessHandle = [];
const setSession = (session) => {
	sessHandle = session;
};

Handlebars.registerHelper("json", (context) => {
	return JSON.stringify(context);
});

app.listen("3000", () => {
	console.log("Listening on port");
});

export { setSession };
export default sessHandle;
