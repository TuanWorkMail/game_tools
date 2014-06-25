var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension;

var fs = require('fs');
var chineseFiles = [],
    count = 0,
    queue = [];


    walk(dirPath, function (err, files) {

        if (err) console.log(err);
        else {

            files.filter(function (file) {

                return file.substr(-extension.length) === extension;

            }).forEach(function (file) {
                fs.readFile(file, 'utf-8', function (err, contents) {


                    if (contents.toString().match('CDATA')) {

                        var shortPath = file.replace(dirPath, '');

                        console.log(shortPath)
                    }
                    count++;
                });
            });


        }
    });


function ChineseFile(path) {
    var chineseWords = [];
    return {
        path: path,
        chineseWords: chineseWords
    }
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);

        list.forEach(function (file) {
            file = dir + '/' + file;

            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {

                    walk(file, function (err, res) {
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