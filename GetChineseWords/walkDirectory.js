var walk = function(dir, done) {
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
};

walk(dirPath, function(err, files){
    var extension = '.as',
        extensionLength = -3;

    if(err) console.log(err);
    else {

        files.filter(function (file){
            return file.substr(extensionLength) == extension;
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
