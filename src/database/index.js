"use strict";

import { MongoClient } from "mongodb";

var _db = null;

const DATABASE_NAME = "big-panda-comments";

export default class Database
{
    static connect()
    {
        return new Promise((resolve, reject) =>
        {
            if (_db)
                resolve();

            MongoClient.connect("mongodb://127.0.0.1:27017/" + DATABASE_NAME, (error, database) =>
            {
                if (error)
                    return reject(error);

                _db = database;
                resolve();
            });
        });
    }

    static close()
    {
        if (_db != null)
            _db.close();
    }

    static get()
    {
        return _db;
    }
}