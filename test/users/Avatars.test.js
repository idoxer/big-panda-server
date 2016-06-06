"use strict";

import { assert } from "chai";
import Database from "../../src/database";
import Avatars from "../../src/users/Avatars";

describe("Avatar should fetch the user gravatar", () =>
{
    it("should return valid gravatar url image", done =>
    {
        assert.equal(Avatars.getAvatarURL("elik@bigpanda.io"), "//www.gravatar.com/avatar/7a06b72176ef465d35010bc595aa6a66");

        done();
    });

    it("should insert/update the gravatar by given email", done =>
    {
        Database
            .connect()
            .then(() =>
            {
                return Avatars
                    .fetch({email: "elik@bigpanda.io"})
                    .then(data =>
                    {
                        assert.equal(data.avatar.url, "//www.gravatar.com/avatar/7a06b72176ef465d35010bc595aa6a66");
                        done();
                    })
                    .catch(error =>
                    {
                        console.log("error", error);
                    })
            })
            .catch(error =>
            {
                console.log("error", error);
            });
    });

    it("should get the avatar from the database", done =>
    {
        Database
            .connect()
            .then(() =>
            {
                return Avatars
                    .getAvatar("elik@bigpanda.io")
                    .then(avatar =>
                    {
                        assert.notEqual(avatar, null);
                        assert.equal(avatar.url, "//www.gravatar.com/avatar/7a06b72176ef465d35010bc595aa6a66");
                        done();
                    })
                    .catch(error =>
                    {
                        console.log("error", error);
                    });
            })
            .catch(error =>
            {
                console.error("error", error);
            });
    });
});