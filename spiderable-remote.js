var fs = Npm.require('fs');
var phantomjs_remote = Npm.require('phantomjs-remote');
var querystring = Npm.require('querystring');
var urlParser = Npm.require('url');
var app = __meteor_bootstrap__.app;

Spiderable = {};

// list of bot user agents that we want to serve statically, but do
// not obey the _escaped_fragment_ protocol. The page is served
// statically to any client whos user agent matches any of these
// regexps. Users may modify this array.
Spiderable.userAgentRegExps = [/^facebookexternalhit/i, /^linkedinbot/i];

// how long to let phantomjs run before we kill it
// var REQUEST_TIMEOUT = 15*1000;  // add to phantomjs_remote?

app.use(function (req, res, next) {
  if (/\?.*_escaped_fragment_=/.test(req.url) ||
      _.any(Spiderable.userAgentRegExps, function (re) {
        return re.test(req.headers['user-agent']); })) {

    // reassembling url without escaped fragment if exists
    var parsedUrl = urlParser.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query);
    delete parsedQuery['_escaped_fragment_'];
    var newQuery = querystring.stringify(parsedQuery);
    var newPath = parsedUrl.pathname + (newQuery ? ('?' + newQuery) : '');
    var url = "http://" + req.headers.host + newPath;

    var phantomScript = "var url = " + JSON.stringify(url) + ";" +
          "var page = require('webpage').create();" +
          "page.open(url);" +
          "setInterval(function() {" +
          "  var ready = page.evaluate(function () {" +
          "    if (typeof Meteor !== 'undefined' " +
          "        && typeof(Meteor.status) !== 'undefined' " +
          "        && Meteor.status().connected) {" +
          "      Deps.flush();" +
          "      return Meteor._LivedataConnection._allSubscriptionsReady();" +
          "    }" +
          "    return false;" +
          "  });" +
          "  if (ready) {" +
          "    var out = page.content;" +
          "    out = out.replace(/<script[^>]+>(.|\\n|\\r)*?<\\/script\\s*>/ig, '');" +
          "    out = out.replace('<meta name=\"fragment\" content=\"!\">', '');" +
          "    console.log(out);" +
          "    phantom.exit();" +
          "  }" +
          "}, 100);\n";

    phantomjs_remote.send(phantomScript, function(error, result) {
        if (!error) {
          res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
          res.end(result);
        } else {
          // phantomjs failed. Don't send the error, instead send the
          // normal page.
          Meteor._debug('spiderable: ' + error);
          next();
        }
    }, { 'load-images': 'no' }, 'localhost', '8000');

  } else {
    next();
  }
});
