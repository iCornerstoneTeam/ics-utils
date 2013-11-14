/**
 * Control: Asset
 * 
 * Static Assets
 */
var FS = require('fs');
var MIME = require('mime');
var Path = require('path');

exports.route = function(app, options) {
    options = options || {};
    var asset_root = Path.resolve(__dirname, options.path || "../../asset");

    function stream(path, res, next) {
        FS.stat(path, function(err, stats) {
            if (err && err.code == "ENOENT")
                return next("route");
            if (err)
                return next(err);
            if(stats.isDirectory())
                return next("route");

            res.set("Content-Type", MIME.lookup(path));
            res.set("Content-Length", stats.size);
            FS.createReadStream(path).pipe(res);
        });
    }

    // Shortened path to versioned min.<type>
    app.get("/asset/:name/:version.:type", function(req, res, next) {
        var params = req.params;
        var path = Path.join(asset_root, params.name,
            params.version, params.type, "min." + params.type);

        stream(path, res, next);
    });
    
    // Other assets
    app.get(RegExp("/asset/(.+)"), function(req, res, next) {
        var params = req.params;
        var path = Path.join(asset_root, params[0]);

        stream(path, res, next);
    })
};
