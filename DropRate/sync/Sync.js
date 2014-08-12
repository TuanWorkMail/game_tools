function initialize() {

    readFile(config.filePath, parseFile);
}

function parseFile() {

    var lastKey;

    (function () {
        var countDataBase = 0;

        for (var key in DataBase) {
            if (DataBase.hasOwnProperty(key)) {
                countDataBase++;

                lastKey = key;
            }
        }
        document.getElementById('countJson').innerHTML += json.length;
        document.getElementById('countDatabase').innerHTML += countDataBase;
        console.log('last DataBase key: ' + lastKey);
    })();

    var alreadyRun = false;

    function outputJson(compare) {
        if (alreadyRun) {
            alert('please F5');
            return;
        }

        var html = '[{<br/>';

        for (var j = 0; j < json.length; j++) {

            for (var key in DataBase) {
                if (DataBase.hasOwnProperty(key)) {

                    if (json[j].id == DataBase[key].id) {

                        for (var key2 in json[j]) {
                            if (json[j].hasOwnProperty(key2)) {

//                                if(key2 == 'name' && compare) continue;
                                if(key2 == 'share' && compare) {console.log('skip');continue;}

                                for (var key3 in DataBase[key]) {
                                    if (DataBase[key].hasOwnProperty(key3)) {

                                        if (key2 == key3) {

                                            json[j][key2] = DataBase[key][key3];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                    if (key == lastKey) {
                        document.getElementById('missing').innerHTML += JSON.stringify(json[j]) + '<br/><br/>';
                    }
                }
            }
            var first = true;

            for (key2 in json[j]) {
                if (json[j].hasOwnProperty(key2)) {

                    if (first) {
                        first = false;
                        html += '"' + key2 + '":"' + json[j][key2] + '"';
                    } else {
                        html += ',<br/>"' + key2 + '":"' + json[j][key2] + '"';
                    }
                }
            }

            if (j < json.length - 1) html += '<br/>' + '},{' + '<br/>';
            else html += '<br/>' + '}]';
        }

        document.getElementById('output').innerHTML = html;

        alreadyRun = true;


        for (var key in DataBase) {
            if (DataBase.hasOwnProperty(key)) {

                for (var j = 0; j < json.length; j++) {

                    if (json[j].id == DataBase[key].id) {
                        break;
                    }
                    if (j == json.length - 1) {

                        // clone 1 json, then sync that clone with DataBase and display

                        var first = true;

                        for (key2 in json[j]) {
                            if (json[j].hasOwnProperty(key2)) {

                                if (first) {
                                    first = false;
                                    html += '"' + key2 + '":"' + json[j][key2] + '"';
                                } else {
                                    html += ',<br/>"' + key2 + '":"' + json[j][key2] + '"';
                                }
                            }
                        }
                        html += '<br/>' + '},{' + '<br/>';
                    }
                }
            }
        }
    }

    // problem is first identify string or number BEFORE sync
    function outputSwf() {
        if (alreadyRun) {
            alert('please F5');
            return;
        }

        var html = '';

        for (var key in DataBase) {
            if (DataBase.hasOwnProperty(key)) {

                for (var j = 0; j < json.length; j++) {

                    if (json[j].id == DataBase[key].id) {

                        for (var key3 in DataBase[key]) {
                            if (DataBase[key].hasOwnProperty(key3)) {

                                for (var key2 in json[j]) {
                                    if (json[j].hasOwnProperty(key2)) {

                                        if (key2 == key3) {

                                            if(typeof DataBase[key][key3]=="number") {
                                                DataBase[key][key3] = + json[j][key2];
                                            } else if (typeof DataBase[key][key3]=="boolean"){
                                                if(json[j][key2]=='true') DataBase[key][key3] = true;
                                                else DataBase[key][key3] = false;
                                            } else {
                                                DataBase[key][key3] = json[j][key2];
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                    if (j == json.length - 1) {
                        document.getElementById('missing').innerHTML += JSON.stringify(DataBase[key]) + '<br/><br/>';
                    }
                }
                html += 'this.DataBase["' + name + '"][' + key + '] = {';

                var first = true;

                for (key3 in DataBase[key]) {
                    if (DataBase[key].hasOwnProperty(key3)) {

                        if(first){
                            first = false;
                        } else {
                            html += ', ';
                        }
                        if(typeof DataBase[key][key3]=="string") {
                            html += key3 + ': "' + DataBase[key][key3] + '"';
                        } else {
                            html += key3 + ': ' + DataBase[key][key3];
                        }
                    }
                }
                html += '};\n';
            }
        }

        var output = document.getElementById('output');
        output.textContent = html;
        output.innerHTML = output.innerHTML.replace(/\n\r?/g, '<br />');

        alreadyRun = true;
    }
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

var PropsConfig = require('./PropConfig');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

io.on = io.on || 'webStorm sucked';
io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function(){

        createFile("D:\\json\\json" + fileCount + ".txt", string);

    });
});

initialize();