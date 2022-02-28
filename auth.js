const dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var config = require("../../config");

var User = require("../models/user");

dotenv.config();
module.exports = {
    ensureToken(req, res, next) {
        var token = req.get("token");
        var device_id = req.get("device_id");
        var device_type = req.get("device_type");
        var timezone = req.get("timezone");
        var device = req.get("device");
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err && token != process.env.STATIC_TOKEN) {
                res.statusCode = process.env.SES;
                res.json({
                    message: "Your session has been expired!!",
                });
            } else {
                if (decoded && decoded.id) {
                    saveDeviceId(decoded.id, device_id, device_type);
                    if (timezone) {
                        saveTimeZone(decoded.id, timezone);
                    }
                    User.getProfile(decoded.id, function (err, userStatus) {
                        if (userStatus && userStatus.status == "SUS") {
                            res.statusCode = process.env.SUS;
                            res.json({
                                message: process.env.SUSTEXT,
                            });
                        } else if (userStatus && userStatus.status == "DEACT") {
                            res.statusCode = process.env.SES;
                            res.json({
                                message: "Your account has been de-activated by admin.",
                            });
                        } else {

                            res.statusCode = process.env.SES;
                            res.json({
                                message: "Your session has been expired!!"
                            })

                        }
                    });
                } else {
                    next();
                }
            }
        });

        function saveDeviceId(user_id, device_id, device_type) {
            User.saveDeviceId(
                user_id,
                device_id,
                device_type,
                function (err, userStatus) {
                    console.log("calleddd save device id");
                }
            );
        }

        function saveTimeZone(user_id, timezone) {
            User.saveTimeZone(user_id, timezone, function (err, userStatus) {
                console.log("calleddd save timezone");
            });
        }
    }
};
