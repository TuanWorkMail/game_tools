var dirPath = require('./config').dirPath;

var fs = require('fs');

var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


var chineseFiles = [];


io.on('connection', function(socket){

    walk(dirPath, function(err, files){
        if(err) console.log(err);
        else {
            files.filter(function (file){
                return file.substr(-3) == '.as';
            }).forEach(function (file) {
                fs.readFile(file, 'utf-8', function(err, contents) {
                    findChineseCharacter(contents, file);
                });
            });
            io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles) });

            function findChineseCharacter(contents, file) {

                // get all words inside " "
                var words = contents.match(/"(.*?)"/gi);

                if(!words) return;

                var first = true;

                for (var i = 0; i < words.length; i++) {
                    var word = words[i];

                    if (word.match(/[\u3400-\u9FBF]/)) {
                        if(first){
                            first = false;

                            var shortPath = file.replace(dirPath,'');

                            chineseFiles.push(new ChineseFile(shortPath));
                        }
                        chineseFiles[chineseFiles.length-1].chineseWords.push({index: i, word: word});
                    }
                }
            }

        }
    });

});


function ChineseFile(path){
    var chineseWords = [];
    return {
        path: path,
        chineseWords: chineseWords
    }
}