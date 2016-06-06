"use strict";

import express from "express";
import api from "./api";
import Database from "./database";

const WEB_SERVER_PORT = 5200;

const app = express();

Promise.resolve(null)
    .then(Database.connect)
    .then(init)
    .catch(error =>
    {
        console.error("Failed to initialize the server, error: " + error);
    });

function init()
{
    app.use((req, res, next) =>
    {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        next();
    });

    app.set("trust proxy");

    app.get("/", (req, res, next) =>
    {
        res.status(403).end();
    });

    api(app);

    app.listen(WEB_SERVER_PORT, () =>
    {
        console.log("[HTTP] Server running at http://localhost:%d", WEB_SERVER_PORT);
    });
}