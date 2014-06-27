var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension,
    xml2js = require('xml2js'),
    xmlParser = xml2js.Parser(),
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

var alreadyReadFile = false,
    vietnameseFiles = [];

var fileWalk = require('./fileWalk'),
    walkFile = fileWalk._walk,
    readFile = fileWalk.readFile,
    walkXml = require('./xmlWalk').walkXml;

// read file only once
if(!config.getWordMode){

    readFile(config.filePath, function (contents) {

//        var _contents = contents.replace('\r\n', '\n').replace('\r','');
        var _contents = contents;

        var lines = _contents.split('\n');

        lines.forEach(function (line){
            var entries = line.split('\t');

            if(entries.length !== 4) util.debug('length !== 4');

            // REMEMBER TO SORT THE EXCEL FILE FIRST
            // if array is empty OR if current path is different from the last path
            if(vietnameseFiles.length === 0 || vietnameseFiles[vietnameseFiles.length-1].path !== entries[0]){
                vietnameseFiles.push(new File(entries[0]));
            }
            if(typeof entries[2] !== 'undefined') {
                var word = entries[2];
                var word2 = word.replace('\r', '');
            } else {
                word2 = entries[2];
            }

            vietnameseFiles[vietnameseFiles.length-1].Words.push({i: entries[1], zh: entries[2], vn: entries[3]});
        });

//        util.debug(JSON.stringify(vietnameseFiles, undefined, 2));

        replaceChineseWithVietnamese();
    });

    alreadyReadFile = true;
} else main();

var alreadyWords = [];

function replaceChineseWithVietnamese(){

    walkFile(dirPath, extension, function (contents, file) {

        // loop vietnamese words
        for (var i = 0; i < vietnameseFiles.length; i++) {
            var vietnameseFile = vietnameseFiles[i];

            // get words from the same file path
            if (vietnameseFile.path === getShortPath(file)) {

                // word length
                var wordLengths = [];

                for (var j = 0; j < vietnameseFile.Words.length; j++) {
                    var _word = vietnameseFile.Words[j];

                    wordLengths.push({_length: _word.w.length, word: _word});
                }
                // sort word length
                function compare(a,b) {
                    if (a._length < b._length)
                        return 1;
                    if (a._length > b._length)
                        return -1;
                    return 0;
                }
                wordLengths.sort(compare);

                // replace the word
                for (var j = 0; j < wordLengths.length; j++) {
                    var wordLength = wordLengths[j];

                }
            }

        }

    });

}

function main() {

    walkFile(dirPath, extension, function (contents, file) {

        wordCount = 0;
        var firstChineseOfFile = true;

        xmlParser.parseString(contents, function (err, result) {

            walkXml(result, function (word, object, property, type) {

                // if end of xml file, write file to disk
                if (word === 'EoF_EoF') {

                    var builder = new xml2js.Builder({renderOpts: { 'pretty': true, 'indent': '  ', 'newline': '\n' }});
                    var xml = builder.buildObject(result);
//                    util.debug(xml);

                    var xml2 = unescapeHTML(xml);

                    createFile(dirPath+'_output'+getShortPath(file), xml2);
                }

                // for every word found in xml, check if chinese
                checkChinese(word, function (isChinese) {

                    if(isChinese) {

                        // extract mode
                        if (config.getWordMode) {

                            if (characterCount > config.characterLimit) {

                                createFile("D:\\json\\json" + fileCount + ".txt", string);

                                fileCount++;
                                string = '';
                                chineseFiles = [];

                                characterCount = 0;
                            }

                            if (firstChineseOfFile) {

                                var shortPath = getShortPath(file);
                                chineseFiles.push(new File(shortPath));

                                var _string = shortPath + '\n';
                                characterCount += _string.length;
                                string += _string;

                                firstChineseOfFile = false;
                            }

//                util.debug(JSON.stringify(chineseFiles));
//                chineseFiles[chineseFiles.length - 1].Words.push({i: wordCount, w: escapeHtml(word)});

                            _string = wordCount + '\nw":"' + word + '"\n';

                            characterCount += _string.length;
                            string += _string;



                        } else {  //put word mode on

                            var fileFound = false,
                                wordFound = false;

                            // loop vietnamese words
                            for (var i = 0; i < vietnameseFiles.length; i++) {
                                var vietnameseFile = vietnameseFiles[i];

                                // get words from the same file path
                                if (vietnameseFile.path === getShortPath(file)) {

//                                util.debug(vietnameseFile.path + ' === ' + getShortPath(file));

                                    for (var j = 0; j < vietnameseFile.Words.length; j++) {
                                        var _word = vietnameseFile.Words[j];

//                                    util.debug(_word.i +'!=='+ wordCount);

                                        // check word position
                                        if (_word.i == wordCount) {

                                            if (_word.w !== '#N/A') {

                                                if (type === 'content') {

                                                    // replace chinese in xml with vietnamese from txt file
                                                    object[property] = addCDATA(_word.w);

                                                } else {
                                                    object[property] = _word.w;
                                                }

                                                wordFound = true;
                                                break;
                                            }
                                        }
                                    }
                                    if(!wordFound){
                                        object[property] = addCDATA(word);
                                    }
                                    fileFound = true;
                                    break;
                                }
                            }
                            if(!fileFound) util.debug('cannot find file: '+getShortPath(file));
                        }

                    }else{
                        if(type === 'content'){
                            object[property] = addCDATA(word);
                        }
                    }
                });
            });
        });
        xmlParser.reset();
    });

}

function addCDATA(word){

    var check = false;

    for (var i = 0; i < alreadyWords.length; i++) {
        var alreadyWord = alreadyWords[i];

        if(alreadyWord === word) {

            check = true;
            break;
        }
    }
    if(!check){

        var string = '<![CDATA['+word+']]>';

        alreadyWords.push(string);

        return string;
    } else {
        return word;
    }
}

function unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
}

function getShortPath(path){
    return path.replace(dirPath, '');
}

function checkChinese(word, callback) {

    if (word.toString().match(/[\u3400-\u9FBF]/)) {

        callback(true);
    } else {
        callback(false);
    }
    wordCount++;

    // find a word that unique to seperate
    if (word.toString().match('`')) console.log(word);
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

io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
});

function File(path) {
    var Words = [];
    return {
        path: path,
        Words: Words
    }
}

