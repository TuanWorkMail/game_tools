var fs = require('fs');

exports._walk = function(dirPath, extension, callback) {

    walk(dirPath, function (err, files) {

        if (err) console.log(err);
        else {

            files.filter(function (file) {

                return file.substr(-extension.length) === extension;

            }).forEach(function (file) {

                readFile(file, function callback2(contents){

                    callback(contents, file);
                })
            })
        }
    })
};

// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
function walk(dir, callback) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null, results);

        // change from forEach to check last iteration
        for (var i = 0; i < list.length; i++) {
            var file = list[i];

            file = dir + '/' + file;

            // because fs.stat is async
            (function(file, i){

                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {

                        walk(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) callback(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) callback(null, results);
                    }
                });

                //if the last file in root dir
                if(i===list.length-1) callback(null, 'EoD_EoD');

            })(file, i);

        }
    });
}

function readFile(path, callback){
    fs.readFile(path, 'utf-8', function (err, contents) {
        if(err) console.log(err);

        else callback(contents);
    })
}
exports.readFile = readFile;

//walk(dirPath, function (err, files) {
//
//    if (err) console.log(err);
//    else {
//
//        files.filter(function (file) {
//
//            return file.substr(-extension.length) === extension;
//
//        }).forEach(function (file) {
//            fs.readFile(file, 'utf-8', function (err, contents) {
//
//                xmlParser.parseString(contents, function (err, result) {
//
////                    console.log(file);
//                    count = 0;
//                    first = true;
//
//                    // first go into the root node
//                    for (var rootNode in result) {
//                        if (result.hasOwnProperty(rootNode)) {
//
//                            walkXml(result[rootNode]);
//
//                            function walkXml(result) {
//
//                                // walk into each tag of  root xml tag
//                                for (var _node in result) {
//                                    if (result.hasOwnProperty(_node)) {
//
//                                        // walk all content of the same tag
//                                        for (var i = 0; i < result[_node].length; i++) {
//                                            var node = result[_node][i];
//
//                                            // check content inside the tag
//                                            if (typeof node === 'object') {
//
//                                                // check properties of tag
//                                                if(node.$) {
//                                                    for (var property in node.$) {
//                                                        if (node.$.hasOwnProperty(property)) {
//
//                                                            checkChinese(node.$[property], file);
//                                                        }
//                                                    }
//                                                }
//                                                if (node._) {
//                                                    checkChinese(node._, file);
//                                                }
//                                                // walk into child node
//                                                for (var childNode in node) {
//                                                    if (node.hasOwnProperty(childNode)) {
//                                                        if (childNode !== '$' && typeof node[childNode] === 'object') {
//                                                            walkXml(node);
//                                                        }
//                                                    }
//                                                }
//                                            } else {
//                                                checkChinese(node, file);
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                });
//            });
//        });
//        createFile();
//    }
//});
