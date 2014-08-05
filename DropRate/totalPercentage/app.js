function initialize() {

    readFile(config.filePath, parseFile);
}


function parseFile(contents) {

    var json = JSON.parse(contents);

    var rewardNo_rate = [],
        rewardNo_percentage = [];

    for (var j = 0; j < json.length; j++) {
        var jsonElement = json[j];

        if(typeof jsonElement.serialNums !== 'undefined' && jsonElement.serialNums.match('30000')) {

            // get total rate of each rewardNo of 1 item
            if(rewardNo_rate.length === 0) rewardNo_rate.push( { rewardNo: jsonElement.rewardNo, rate: jsonElement.rate, totalRate: 0, count: 1 } );

            // compare jsonElement rewardNo with rewardNo_rate, if exist increase then break, if not create new
            for (var i = 0; i < rewardNo_rate.length; i++) {
                var _rewardNo_rate = rewardNo_rate[i];

                if(_rewardNo_rate.rewardNo === jsonElement.rewardNo) {

                    _rewardNo_rate.rate = +_rewardNo_rate.rate + +jsonElement.rate;
                    _rewardNo_rate.count++;
                    break;
                }
                if(i===rewardNo_rate.length-1) {
                    rewardNo_rate.push( { rewardNo: jsonElement.rewardNo, rate: jsonElement.rate, totalRate: 0, count: 1 } );
                    break;
                }
            }
        }
    }

    // get total rate of each rewardNo to calculate percentage
    json.forEach(function eachJsonElement2(jsonElement){

        for (var i = 0; i < rewardNo_rate.length; i++) {
            var _rewardNo_rate = rewardNo_rate[i];

            if(_rewardNo_rate.rewardNo === jsonElement.rewardNo) {

                _rewardNo_rate.totalRate += +jsonElement.rate;
                break;
            }
        }
    });

    //calculate percentage
    rewardNo_rate.forEach(function eachRewardNo_rate(_rewardNo_rate){

        rewardNo_percentage.push( { rewardNo: _rewardNo_rate.rewardNo, percentage: Math.round(_rewardNo_rate.rate/_rewardNo_rate.totalRate*100), count: _rewardNo_rate.count } )
    });

    console.log(rewardNo_percentage);
}

////////////////////////////////////////////////////////////

var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension,
    util = require('util');

var app = require('express')();
var http = require('http').Server(app);
app.get = app.get || 'webStorm sucked';
app.get('/', function (req, res) {
    res.sendfile('./fromXml/index.html');
});
app.get('/jquery-1.10.2.js', function (req, res) {
    res.sendfile('fromXml/jquery-1.10.2.js');
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});

var fs = require('fs');
var io = require('socket.io')(http);
var chineseFiles = [],
    wordCount = 0,
    string = '',
    characterCount = 0,
    fileCount = 0;

var fileWalk = require('./fileWalk'),
    walkFile = fileWalk._walk,
    readFile = fileWalk.readFile;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

io.on = io.on || 'webStorm sucked';
io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function(){

        createFile("D:\\json\\json" + fileCount + ".txt", string);

    });
});

initialize();