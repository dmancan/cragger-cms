var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');


var app = express();

/* Parse */

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost for testing.');
}

//mongodb://localhost:27017/dev
var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_6gr5p5cs:1p4idvipdcg24ab4qnmou56aa8@ds121171.mlab.com:21171/heroku_6gr5p5cs',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


var port = process.env.PARSE_PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

/* end Parse */



app.set('webport', (process.env.PORT || 3000));

app.use('/public', express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

app.listen(app.get('webport'), function() {
  console.log('Node app is running on port', app.get('webport'));
});
