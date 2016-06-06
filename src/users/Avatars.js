"use strict";

import gravatar from "gravatar";
import Database from "../database";
import Errors from "../constants/Errors";

export default class Avatars
{
    static db()
    {
        return Database.get().collection("avatars");
    }

    /**
     * Check if avatar is exists by given email
     * @param {string} email - Email of the gravatar
     * @return {boolean} true if exists
     */
    static exists(email)
    {
        return !!Avatars.getAvatar(email);
    }

    /**
     * Get the avatar data by email
     * @param {string} email - Email of the gravatar
     */
    static getAvatar(email)
    {
        return Avatars.db().findOne({email});
    }

    /**
     * Get the avatar from the db if exists, if not fetch and save it
     * @param {Object} data
     *  @property {string} data.email - Email address
     *  @property {string} data.message - Comment message
     */
    static get(data)
    {
        return new Promise((resolve, reject) =>
        {
            Avatars
                .getAvatar(data.email)
                .then(avatar =>
                {
                    if (avatar)
                    {
                        data.avatar = avatar.url;
                        return resolve(data);
                    }

                    // Fetch the missing avatar
                    Avatars
                        .fetch(data)
                        .then(response =>
                        {
                            data.avatar = response.avatar.url;
                            return resolve(data);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     * Get the gravatar url by email
     * @param email
     */
    static getAvatarURL(email)
    {
        return gravatar.url(email);
    }

    /**
     * Fetch the avatar from gavatar
     * @param data
     */
    static fetch(data)
    {
        return new Promise((resolve, reject) =>
        {
            const url = Avatars.getAvatarURL(data.email);

            if (!url)
                return reject({code: Errors.GRAVATAR_URL_MISSING});

            // Insert the new gravatar
            Avatars.db().update({email: data.email}, {$set: {url}}, {upsert: true}, (error, docs) =>
            {
                if (error)
                    return reject(error);

                if (!docs || !docs.result || !docs.result.ok)
                    return reject({code: Errors.GRAVATAR_URL_CREATION_FAILED});

                data.avatar = {url};
                resolve(data);
            });
        });
    }
}