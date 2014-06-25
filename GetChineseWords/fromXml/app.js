var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension,
    xmlParser = require('xml2js').Parser(),
    escapeHtml = require('./escapeHtml').escapeHtml,
    util = require('util');

var app = require('express')();
var http = require('http').Server(app);
app.get('/', function (req, res) {
    res.sendfile('fromXml/index.html');
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

var walkFile = require('./fileWalk')._walk,
    walkXml = require('./xmlWalk').walkXml;

walkFile(dirPath, extension, function(contents, file){

    wordCount = 0;
    var firstChineseOfFile = true;

    xmlParser.parseString(contents, function (err, result) {

        walkXml(result, function callback(word){

            checkChinese(word, function callback2(){

                if(characterCount > 12000){

                    createFile();
                    characterCount = 0;
                }

                if(firstChineseOfFile){

                    var shortPath = file.replace(dirPath, '');
                    chineseFiles.push(new ChineseFile(shortPath));

                    var _string = shortPath + '\n';
                    characterCount += _string.length;
                    string += _string;

                    firstChineseOfFile = false;
                }

//                util.debug(JSON.stringify(chineseFiles));
//                chineseFiles[chineseFiles.length - 1].chineseWords.push({i: wordCount, w: escapeHtml(word)});

                _string = wordCount + '\nw":"' + word + '\n';

                characterCount += _string.length;
                string += _string;
            });
        });
    });
});


function checkChinese(word, callback) {

    if (word.toString().match(/[\u3400-\u9FBF]/)) {

        callback();
    }
    wordCount++;

    // find a word that unique to seperate
    if (word.toString().match('`')) console.log(word);
}

function createFile(){
    var content = '';
//    content = JSON.stringify(chineseFiles, undefined, 2);
    content = string;

    fs.writeFile("D:\\json\\json"+fileCount+".txt", content, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file json"+fileCount+".txt was saved!");
        }
    });

    fileCount++;

    string = '';
    chineseFiles = [];
}

io.on('connection', function (socket) {



//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
});


function ChineseFile(path) {
    var chineseWords = [];
    return {
        path: path,
        chineseWords: chineseWords
    }
}

