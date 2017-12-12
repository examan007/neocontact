var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var Governor = require('../server/governor.js').getGovernor();

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.CurrentDirectory = 'c:/wip/neoc20171210/';

app.get('*',function(req,res){
  app.showRequest(req);
  var filename = 'index.html';
  var end;
  if (req.url === '/') {} else
  if ((end = req.url.indexOf('?')) < 0) {
    filename = req.url;      
  } else {
    filename = req.url.substr(0, end);
  }
  res.sendFile(app.CurrentDirectory + filename);
});
app.showRequest = function (req) {
    console.log('url=' + JSON.stringify(req.url));
    console.log('headers=' + JSON.stringify(req.headers));
    console.log('body=' + JSON.stringify(req.body));
}
app.save = function (obj, success, failure) {
        var fs = require('fs');
        try {
            fs.writeFileSync('../logs/blog.' + (new Date()).getTime() + '.json',
                JSON.stringify(obj).toString('utf-8'));
            success();
        } catch (e) {
            console.log('save=' + e.toString());
            failure(e.toString());
        }
}
app.post('/private',function(req,res){
    //app.showRequest(req);
    if (Governor.checkSession(req) == false) {
        return;
    }
    app.showRequest(req);
    function getEntry(attrs) {
        var entry = new Object();
        for (var i = 0; i < attrs.length; i++) {
            console.log('objz=' + JSON.stringify(attrs[i]));
            var key = (attrs[i])['key'];
            var val = (attrs[i])['value'];
            var type = (attrs[i])['type'];
            if (typeof(type) === 'undefined') {
                entry[key] = val;
            } else
            if (type.indexOf('array') < 0) {
                entry[key] = val;
            } else 
            if (typeof(entry[key]) === 'undefined') {
                entry[key] = [val];
            } else {
                entry[key].push(val);
            }
        }
        return (entry);
    }
    function getBody(body) {
        var entry = new Object();
        for(var key in body) {
            console.log('key=' + key);
            entry = getEntry(eval('[' + key + ']'));
            console.log(JSON.stringify(entry));
        }
        return (entry);
    }
    var entry = getBody(req.body);
    var moment = require('moment');
    entry.create = moment().utc();
    app.save(entry,
        function () {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var obj = {
                result: "true",
                message: "done OK!",
                status: "Success"
            }
            msg = JSON.stringify(obj);
            console.log('RESPONSE=[' + msg + ']');
            res.end(msg);
        },
        function (err) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var obj = {
                result: "false",
                message: err,
                status: "Error"
            }
            msg = JSON.stringify(obj);
            console.log('RESPONSE=[' + msg + ']');
            res.end(msg);
        }
    );
});
app.listen(3030,function(){
  console.log("Started on PORT 3030");
})


function init() {
    app.use(function(req, res, next) {
        app.showRequest(req);
        console.log('url=' + JSON.stringify(req.url));
        console.log('headers=' + JSON.stringify(req.headers));
        });
}
var corsOptions = {
  origin: 'http://localhost:3030',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors());
