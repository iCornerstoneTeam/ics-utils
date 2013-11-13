/**
 * Control : Logger
 */
var Express = require("express");
var Winston = require("winston");

var logger = Winston.loggers.add("express-requests");
exports.winston = function(format) {
    return Express.logger({
        stream : {
            write : function(message) {
                // Remove trailing line break
                logger.info(message.substr(0, message.length - 1));
            }
        }
    });
};
