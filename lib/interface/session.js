/**
 * Interface: Session Connect to the session service
 */
var Request = require("request");
var Express = require("express");
var URL = require("url");
var Util = require("util");

var Service = exports.Service = function(servers) {
    this.servers = servers;
};
Util.inherits(Service, Express.session.Store);

function nothing() {};
function uri(id, timeout) {
    var server = this.servers[Math.floor(Math.random() * (this.servers.length - 1))]
    return URL.format({
        protocol : "http",
        hostname : server.hostname,
        port : server.port,
        pathname : "/session/" + id,
        query : {
            timeout : timeout
        }
    });
}

function serviceRequest(id, action, timeout, session, callback) {
    if (typeof session === "function") {
        callback = session;
        session = true;
    }
    callback = typeof callback === "function" ? callback : nothing;
    Request({
        method : action,
        uri : uri.call(this, id, timeout),
        json : session
    }, function(err, res, session) {
        // Failure Modes
        if (err)
            return callback(err);
        if (res.statusCode == 404)
            return callback();
        if (res.statusCode >= 300)
            return callback(session);

        // Session
        callback(null, session);
    });
}

Service.prototype.get = function(id, callback) {
    serviceRequest.call(this, id, "GET", callback)
};

Service.prototype.set = function(id, session, callback) {
    serviceRequest.call(this, id, "PUT", session, callback);
};

Service.prototype.destroy = function(id, callback) {
    serviceRequest.call(this, id, "DELETE", callback);
};
