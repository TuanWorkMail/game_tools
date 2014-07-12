var dirPath = require('./config').dirPath;

var fs = require('graceful-fs');
var util = require('util');

var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('./index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var chineseFiles = [];

function main(){
    walk(dirPath, function(err, files){
        if(err) console.log(err);
        else {
            files.filter(function (file){
                return file.substr(-3) == '.as';
            }).forEach(function (file) {
                fs.readFile(file, 'utf-8', function(err, contents) {
                    if(err) util.debug(err);
                    else findChineseCharacter(contents, file);
                });
            });
//            io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles) });

            chineseFiles = [];
        }
    });
}
main();

var allChineseString = '';

function findChineseCharacter(contents, file) {

    if(!contents){
        util.debug('err:'+file+'='+contents);
        return;
    }
    util.log(getShortPath(file));

    // get all words inside " "
    var words = contents.match(/"(.*?)"/gi);

    if(!words) return;

    var first = true;

    for (var i = 0; i < words.length; i++) {
        var word = words[i];

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
}
// copy from fromJson
io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
    socket.on('get chinese', function(){

        createFile("D:\\temp\\as.txt", allChineseString);
    });
});

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