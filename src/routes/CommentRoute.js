"use strict";

import Router from "./";
import Comments from "../users/Comments";
import Avatars from "../users/Avatars";
import Core from "../core";

export default class CommentRoute
{
    static submit(req, res)
    {
        const params = ["email", "message"];

        Router.getPost(req, params, post =>
        {
            console.log("post", post);

            if (!post)
                return res.status(400).end();

            // Validate the email
            if (!Core.isEmailValid(post.email))
                return res.status(400).end();

            const data = {};
            data.email = post.email;
            data.message = post.message;

            Promise
                .resolve(data)
                .then(Avatars.get)
                .then(Comments.submit)
                .then(comment =>
                {
                    res.status(200).json({data: comment});
                })
                .catch(error =>
                {
                    console.log("error", error);
                    res.json({error: true});
                });
        });
    }

    static get(req, res)
    {
        Comments
            .get()
            .then(comments =>
            {
                res.status(200).json({data: comments});
            })
            .catch(error =>
            {
                res.json({error: true});
            });
    }
}