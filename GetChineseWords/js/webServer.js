var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');

function startWebServer(htmlFilePath, outputPath){

    // ./GetChineseWords/fromAS/index.html
    app.get('/', function(req, res){
        res.sendfile(htmlFilePath);
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });

    //ERROR
    io.on('connection', function (socket) {
//    io.emit('chat message', { chineseFiles: JSON.stringify(chineseFiles, undefined, 2) });
        socket.on('get chinese', function(){

            createFile(outputPath, allChineseString);
        });
    });
}
exports.startWebServer = startWebServer;


function createFile(path, content){

    fs.writeFile(path, content, function(err) {
        if(err) {
            util.debug(err);
        } else {
            util.log("saved to disk: "+path);
        }
    });
}