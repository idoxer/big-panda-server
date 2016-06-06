"use strict";

import Database from "../database";

export default class Comments
{
    static db()
    {
        return Database.get().collection("comments");
    }

    /**
     * Submit new comments
     * @param {Object} data
     * @property {string} data.email
     * @property {string} data.message
     */
    static submit(data)
    {
        return new Promise((resolve, reject) =>
        {
            data.timestamp = +new Date();

            Comments.db().insert(data, (error, docs) =>
            {
                if (error)
                    return reject(error);

                if (!docs || !docs.result || !docs.result.ok)
                    return reject({code: -1});

                resolve(docs.ops[0]);
            });
        });
    }

    /**
     * Read all the comments
     */
    static get()
    {
        return Comments.db().find({}).sort({timestamp: 1}).toArray();
    }
}