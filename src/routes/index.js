"use strict";

const DEBUG = process.env.DEBUG;

class Router
{
    /**
     * Limited to 1MB
     * @param request
     * @param params
     * @param callback
     */
    static getPost(request, params, callback)
    {
        var body = "";

        request.on("data", data =>
        {
            body += data.toString();

            // Too much POST data, kill the client connection
            if (body.length > 1e6)
            {
                DEBUG && console.warn("[POST] Too large body length (%s)", body.length);
                request.connection.destroy();
            }
        });

        request.on("end", () =>
        {
            try
            {
                if (!body.length)
                {
                    DEBUG && console.error("[POST] Empty body");
                    request.connection.destroy();
                    return;
                }

                const post = JSON.parse(body);

                params.forEach(param =>
                {
                    if (!post[param])
                    {
                        DEBUG && console.error("[POST] Missing param %s", param);
                        request.connection.destroy();
                        callback(null);
                    }
                });

                try
                {
                    callback(post);
                }
                catch (e)
                {
                    DEBUG && console.trace(e);
                    request.connection.destroy();
                }
            }
            catch (e)
            {
                callback(null);
            }
        })
    }
}

export default Router;