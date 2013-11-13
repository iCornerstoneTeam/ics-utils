/**
 * Control: Util: Body
 * Request body aggregator and parser
 */
exports.aggregate = function() {
    return (function(req, res, next) {
        var body = "";
        req.setEncoding("utf8");
        req.on("data", function(chunk) {
            body += chunk;
        });
        
        req.on("end", function(chunk) {
            if(chunk)
                body += chunk;
            
            req.unparsedBody = body.length ? body : undefined;
            next();
        });
    });
};

exports.json = function(strict) {
    return (function(req, res, next) {
        if(!req.unparsedBody)
            return next();
        
        try {
            req.body = JSON.parse(req.unparsedBody);
            next()
        } catch(e) {
            if(strict)
                return next(e);
            
            req.body = {};
            next();
        }
    });
};
