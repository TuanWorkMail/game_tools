function initialize() {

// read file only once

    readFile(config.filePath, function (contents) {

//        var _contents = contents.replace('\r\n', '\n').replace('\r','');
        var _contents = contents;

        var lines = _contents.split('\n');

        lines.forEach(function (line) {
            var entries = line.split('\t');

            var path = entries[0],
                lineNumber = entries[1],
                wordCount = entries[2],
                chinese = entries[3],
                vietnamese = entries[4];

            if (entries.length !== 5) {
                var string = '';
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    string += i + ':' + entry + ';';
                }
                util.error('length!==5::' + string);
                return;
            }

            // REMEMBER TO SORT THE EXCEL FILE FIRST
            // if array is empty OR if current path is different from the last path
            if (vietnameseFiles.length === 0 || vietnameseFiles[vietnameseFiles.length - 1].path !== path) {
                vietnameseFiles.push( { path: path, lines: [] } );
            }
            // if line number is different, create new
            if (typeof vietnameseFiles[vietnameseFiles.length - 1].lines[lineNumber] === 'undefined') {
                vietnameseFiles[vietnameseFiles.length - 1].lines[lineNumber] = { Words: [] } ;
            }
            if (typeof vietnamese !== 'undefined') {
                var word2 = vietnamese.replace(/\r/g, '');
            } else {
                word2 = vietnamese;
            }

            vietnameseFiles[vietnameseFiles.length - 1].lines[lineNumber].Words.push({i: wordCount, zh: chinese, vn: word2});
        });

//        util.debug(JSON.stringify(vietnameseFiles, undefined, 2));

        replaceChineseWithVietnamese();
    });

    alreadyReadFile = true;

}


function replaceChineseWithVietnamese() {

    walkFile(dirPath, extension, function eachFile(contents, file) {
//        util.debug(contents);

        var writeContent = contents;

        var log = '';

        // loop vietnamese words
        for (var i = 0; i < vietnameseFiles.length; i++) {
            var vietnameseFile = vietnameseFiles[i];

            // get words from the same file path
            if (vietnameseFile.path === getShortPath(file)) {

                var allLines = '';

                // split line of chinese file to replace line by line
                var lines = contents.split('\n');
                for (var k = 0; k < lines.length; k++) {
                    var vn = lines[k];

                    if(typeof vietnameseFile.lines[k] === 'undefined') {

                        allLines += vn;
                        continue;
                    }

                    // replace the word
                    for (var j = 0; j < vietnameseFile.lines[k].Words.length; j++) {
                        var wordLength = vietnameseFile.lines[k].Words[j];

                        if (!vn.match(new RegExp(escapeRegExp("'" + wordLength.zh + "'"), 'g'))) log += 'not found:' + wordLength.zh + '\n';

                        if (wordLength.vn !== '#N/A' && wordLength.vn != 0) {

                            var find, replace;

//                        // only replace content not attribute
//                        find = '>' + wordLength.word.zh + '<';
//                        replace = '>' + wordLength.word.vn + '<';
//                        vn = replaceAll(vn, find, replace);
//                        find = '<![CDATA[' + wordLength.word.zh + ']]>';
//                        replace = '<![CDATA[' + wordLength.word.vn + ']]>';
//                        vn = replaceAll(vn, find, replace);

                            // replace sql string
                            find = "'" + wordLength.zh + "'";
                            replace = "'" + wordLength.vn + "'";
                            vn = replaceAll(vn, find, replace);

//                        vn = replaceAll(vn, wordLength.word.zh, wordLength.word.vn);

                        } else util.debug('#N/A:'+wordLength.zh);
                    }
                    allLines += vn;
                    printProcess(k/lines.length*100);
                }

                writeContent = allLines;

                break;

            }
        }

        // eg: d:\temp\webSql.sql_output
        createFile(file + '_output', writeContent);
        createFile(file + '_log', log);

    });

}


////////////////////////////////////////////////////////////

var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension,
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
    string = '',
    fileCount = 0;

var alreadyReadFile = false,
    vietnameseFiles = [];

var fileWalk = require('./fileWalk'),
    walkFile = fileWalk._walk,
    readFile = fileWalk.readFile;


initialize();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getShortPath(path) {
    return path.replace(dirPath, '');
}

function createFile(path, content) {

//    content = JSON.stringify(chineseFiles, undefined, 2);

    fs.writeFile(path, content, function (err) {
        if (err) {
            console.log(err);
        } else {
            util.log("The file " + path + " was saved!");
        }
    });
}

var percentage = 25;
function printProcess(_percentage){
    if(_percentage>percentage) {util.debug('25%'); percentage = 50;}
    if(_percentage>percentage) {util.debug('50%'); percentage = 75;}
    if(_percentage>percentage) {util.debug('75%'); percentage = 99;}
    if(_percentage>percentage) {util.debug('99%'); percentage = 200;}
}

io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function () {

        createFile("D:\\json\\json" + fileCount + ".txt", string);

    });
});

function File(path) {
    var Words = [];
    return {
        path: path,
        Words: Words
    }
}

function escapeRegExp(string) {
    return string.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}