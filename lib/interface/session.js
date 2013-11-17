/**
 * Interface: Session Connect to the session service
 */
var Express = require("express");
var Path = require("path");
var Request = require("request");
var URL = require("url");
var Util = require("util");
var ServerError = require("../server-error");

function nothing() {};

var Session = module.exports = function(server) {
    if(typeof server === "string")
        server = URL.parse(server);
    server = server || {};
    
    this.protocol = server.protocol || "https";
    this.hostname = server.hostname || "session.ics-platform.net";
    this.port = server.port || 9080
    this.pathname = server.pathname || "/";
    
    this.query = {};
    if(server.expires)
        this.query.expires = server.expires;
};
Util.inherits(Session, Express.session.Store);

function request(id, method, data, callback) {
    if (typeof data === "function") {
        callback = data;
        data = true;
    }
    callback = typeof callback === "function" ? callback : nothing;
    
    var path = method === "DELETE" ? Path.join(this.pathname, "session", id) :
        Path.join(this.pathname, "session", id, "data");
    
    var url = URL.format({
        protocol : this.protocol,
        hostname : this.hostname,
        port : this.port,
        pathname : path,
        query : this.query
    });
    
    Request({
        method : method,
        uri : url,
        json : data
    }, function(err, res, data) {
        if (err) // Connection Error
            return callback(err);
        if (res.statusCode == 404) // No Session
            return callback();
        if (res.statusCode >= 300) // Other Remote Error
            return callback(new ICSUtils.ServerError(res.statusCode, url, method, data));

        // Session Data
        callback(null, data);
    });
}

Session.prototype.get = function(id, callback) {
    request.call(this, id, "GET", callback)
};

Session.prototype.set = function(id, data, callback) {
    request.call(this, id, "PUT", data, callback);
};

Session.prototype.destroy = function(id, callback) {
    request.call(this, id, "DELETE", callback);
};
