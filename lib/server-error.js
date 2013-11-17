/**
 * 
 */
var Util = require("util");
var HTTP = require("http");

module.exports = function(code, url, method, data) {
    Error.call(this, "The server responded with code " + code);
    this.name = "ServerError";
    this.method = method;
    this.url = url;
    this.code = code;
    this.status = HTTP.STATUS_CODES[code];
    this.data = data;
};
Util.inherits(module.exports, Error);
