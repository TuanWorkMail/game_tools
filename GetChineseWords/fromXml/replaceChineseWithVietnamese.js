
function replaceChineseWithVietnamese(){

    walkFile(dirPath, extension, function (contents, file) {
//        util.debug(contents);

        var writeContent = contents;

        // loop vietnamese words
        for (var i = 0; i < vietnameseFiles.length; i++) {
            var vietnameseFile = vietnameseFiles[i];

            // get words from the same file path
            if (vietnameseFile.path === getShortPath(file)) {

                // word length
                var wordLengths = [];

                for (var j = 0; j < vietnameseFile.Words.length; j++) {
                    var _word = vietnameseFile.Words[j];

                    wordLengths.push({_length: _word.zh.length, word: _word});
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

                var vn = contents;

                // replace the word
                for (var j = 0; j < wordLengths.length; j++) {
                    var wordLength = wordLengths[j];

//                    util.debug(wordLength.word.zh);
//                    util.debug(escapeRegExp(wordLength.word.zh));
//                    util.debug(wordLength.word.vn);

                    if(wordLength.word.vn !== '#N/A') {


                        var find, replace;

                        // only replace content not attribute
//                        find = '>' + wordLength.word.zh + '<';
//                        replace = '>' + wordLength.word.vn + '<';
//                        vn = replaceAll(vn, find, replace);
//                        find = '<![CDATA[' + wordLength.word.zh + ']]>';
//                        replace = '<![CDATA[' + wordLength.word.vn + ']]>';
//                        vn = replaceAll(vn, find, replace);

                        // replace both content and attribute
                        vn = replaceAll(vn, wordLength.word.zh, wordLength.word.vn);
                    }

                }
//                util.debug(vn);

                writeContent = vn;

                break;

            }
        }

        createFile(dirPath+'_output'+getShortPath(file), writeContent);

    });

}

exports.replaceChineseWithVietnamese = replaceChineseWithVietnamese;