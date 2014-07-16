function initialize() {

// read file only once
    if (!config.getWordMode) {

        readFile(config.filePath, parseFile);

        alreadyReadFile = true;
    } else getChinese();

}


function parseFile(contents) {

    var lines = contents.split('\n');

    lines.forEach(parseLine);

//        util.debug(JSON.stringify(vietnameseFiles, undefined, 2));

    replaceChineseWithVietnamese();
}

function parseLine(line) {
    var entries = line.split('\t');

    if (entries.length !== 4) util.debug('length !== 4');

    // REMEMBER TO SORT THE EXCEL FILE FIRST
    // if array is empty OR if current path is different from the last path
    if (vietnameseFiles.length === 0 || vietnameseFiles[vietnameseFiles.length - 1].path !== entries[0]) {
        vietnameseFiles.push(new File(entries[0]));
    }
    if (typeof entries[3] !== 'undefined') {
        var word = entries[3];
        var word2 = word.replace(/\r/g, '');
    } else {
        word2 = entries[3];
    }

    vietnameseFiles[vietnameseFiles.length - 1].Words.push({i: entries[1], zh: entries[2], vn: word2});
}

function getChinese() {

    walkFile(dirPath, extension, parseFile2);

}

var firstChineseOfFile = true;
var file;

function parseFile2(contents, _file) {

    file = _file;

    util.debug(getShortPath(file));

    wordCount = 0;
    firstChineseOfFile = true;

    xmlParser.parseString(contents, parseXmlFile);
    xmlParser.reset();
}

var word, object, property, type;

function parseXmlFile(err, result) {

    if(err) util.debug(err);
    else walkXml(result, function (_word, _object, _property, _type) {

        word = _word;
        object = _object;
        property = _property;
        type = _type;

        // for every word found in xml, check if chinese
        checkChinese(word, isChinese);
    });
}

function isChinese() {


    // extract mode
    if (config.getWordMode) {

        if (characterCount > config.characterLimit) {

            createFile("D:\\json\\json" + fileCount + ".txt", string);

            fileCount++;
            string = '';
            chineseFiles = [];

            characterCount = 0;
        }

//                            if (firstChineseOfFile) {

        var shortPath = getShortPath(file);
        chineseFiles.push(new File(shortPath));

//                                var _string = shortPath + '\n';
        var _string = shortPath + '\t';

        characterCount += _string.length;
        string += _string;

        firstChineseOfFile = false;
//                            }

        chineseFiles[chineseFiles.length - 1].Words.push({i: wordCount, w: escapeHtml(word)});

//                            _string = wordCount + '\nw":"' + word + '"\n';
        _string = wordCount + '\t' + word + '\n';

        characterCount += _string.length;
        string += _string;


    }

}

////////////////////////////////////////////////////////////

var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension,
    xml2js = require('xml2js'),
    xmlParser = xml2js.Parser(),
    escapeHtml = require('./escapeHtml').escapeHtml,
    util = require('util'),
//    getChinese = require('./getChinese').getChinese,
    replaceChineseWithVietnamese = require('./replaceChineseWithVietnamese').replaceChineseWithVietnamese;

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

var alreadyReadFile = false,
    vietnameseFiles = [];

var fileWalk = require('./fileWalk'),
    walkFile = fileWalk._walk,
    readFile = fileWalk.readFile,
    walkXml = require('./xmlWalk').walkXml;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getShortPath(path){
    return path.replace(dirPath, '');
}

function checkChinese(word, callback) {

    if (word.toString().match(/[\u3400-\u9FBF]/)) {

        callback();
    }
    wordCount++;
}

function createFile(path, content){

//    content = JSON.stringify(chineseFiles, undefined, 2);

    fs.writeFile(path, content, function(err) {
        if(err) {
            console.log(err);
        } else {
            util.log("The file "+path+" was saved!");
        }
    });
}
io.on = io.on || 'webStorm sucked';
io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function(){

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
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

initialize();