"use strict";

import CommentRoute from "./routes/CommentRoute";

export default function (app)
{
    app.post("/comment/submit", CommentRoute.submit);
    app.post("/comment/get", CommentRoute.get);
}