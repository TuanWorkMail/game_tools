var config = require('./config'),
    dirPath = config.dirPath;

var fs = require('graceful-fs');
var util = require('util');

var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('./fromAS/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var chineseFiles = [];

function main(){
    walk(dirPath, eachFile);
}
main();
function eachFile(err, files){
    if(err) console.log(err);
    else {
        files.filter(filterFileExtension).forEach(_readFile);
//            io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles) });

        chineseFiles = [];
    }
}
function filterFileExtension(file){
    if(config.asOrSql === 'sql'){
        return file.substr(-4) == '.sql';
    } else if (config.asOrSql === 'as'){
        return file.substr(-3) == '.as';
    } else {
        util.debug('unknown mode: as OR sql');
        return undefined;
    }
}
function _readFile(file) {
    fs.readFile(file, 'utf-8', function processFile(err, contents) {
        if(err) util.debug(err);
        else findChineseCharacter(contents, file);
    });
}

var allChineseString = '';

function findChineseCharacter(contents, file) {

    if(!contents){
        util.debug('err:'+file+'='+contents);
        return;
    }

    // get all words inside " "
    if(config.asOrSql === 'sql'){
        var words = contents.match(/'(.*?)'/gi);
    } else if (config.asOrSql === 'as'){
        words = contents.match(/"(.*?)"/gi);
    } else {
        util.debug('unknown mode: as OR sql');
        return;
    }


    if(!words) return;

    var first = true;

    for (var i = 0; i < words.length; i++) {
        var word = words[i].slice(1, -1);

//        walkCharacter(word);

        if (word.match(/[\u3400-\u9FBF]/)) {
            if(first){
                first = false;

                var shortPath = getShortPath(file);

                chineseFiles.push(new ChineseFile(shortPath));
            }
            chineseFiles[chineseFiles.length-1].chineseWords.push({index: i, word: word});

            allChineseString += getShortPath(file) + '\t' + i + '\t' + word + '\n';
        }
    }
    util.log(getShortPath(file));
}
// copy from fromJson
io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function(){

        createFile("D:\\temp\\as.txt", allChineseString);
    });
});

//        callback(character);
//    }
//}

var zhCharacters = [];

function getZhCharacter(character){
    if (character.match(/[\u3400-\u9FBF]/)) {
        if(first){
            first = false;

            var shortPath = getShortPath(file);

            chineseFiles.push(new ChineseFile(shortPath));
        }
        chineseFiles[chineseFiles.length-1].chineseWords.push({index: i, word: word});

        allChineseString += getShortPath(file) + '\t' + i + '\t' + word + '\n';
    } else {}
}


function ChineseFile(path){
    var chineseWords = [];
    return {
        path: path,
        chineseWords: chineseWords
    }
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);

        list.forEach(function(file) {
            file = dir + '/' + file;

            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {

                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

// copy from fromJson
function getShortPath(path){
    return path.replace(dirPath, '');
}
// copy from fromJson
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