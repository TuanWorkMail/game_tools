var config = require('./config'),
    dirPath = config.dirPath,
    extension = config.extension;
var fileWalk = require('./fileWalk'),
    walkFile = fileWalk._walk;
var utility = require('./utility'),
    getShortPath = utility.getShortPath,
    createFile = utility.createFile;
var vietnameseFiles;

function replaceChineseWithVietnamese(_vietnameseFiles){
    vietnameseFiles = _vietnameseFiles;
    walkFile(dirPath, extension, eachFile);
}
exports.replaceChineseWithVietnamese = replaceChineseWithVietnamese;

function eachFile (contents, file) {
//        util.debug(contents);

    var writeContent = contents;

    // loop vietnamese words
    for (var i = 0; i < vietnameseFiles.length; i++) {
        var vietnameseFile = vietnameseFiles[i];

        // get words from the same file path
        if (vietnameseFile.path === getShortPath(file, dirPath)) {

            // word length
            var wordLengths = [],
                temp = [];

            for (var j = 0; j < vietnameseFile.Words.length; j++) {
                var _word = vietnameseFile.Words[j];

                temp.push({_length: _word.zh.length, word: _word});
            }
            wordLength = sortArray(temp);

            var vn = contents;

            // replace the word
            for (j = 0; j < wordLengths.length; j++) {
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
                    find = wordLength.word.zh;
                    replace = wordLength.word.vn;
                    vn = replaceAll(vn, find, replace);
                }

            }
//                util.debug(vn);

            writeContent = vn;

            break;

        }
    }

    createFile(dirPath+'_output'+getShortPath(file, dirPath), writeContent);

}

function sortArray(array){
    // sort word length
    return array.sort(compare);
}
function compare(a,b) {
    if (a._length < b._length)
        return 1;
    if (a._length > b._length)
        return -1;
    return 0;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
