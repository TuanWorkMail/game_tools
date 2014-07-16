
function getChinese() {

    walkFile(dirPath, extension, parseFile2);

}

var firstChineseOfFile = true;
var file;

function parseFile2(contents, _file) {

    file = _file;

    util.debug(getShortPath(file));

    wordCount = 0;
    firstChineseOfFile = true;

    xmlParser.parseString(contents, parseXmlFile);
    xmlParser.reset();
}

var word, object, property, type;

function parseXmlFile(err, result) {

    if(err) util.debug(err);
    else walkXml(result, function (_word, _object, _property, _type) {

        word = _word;
        object = _object;
        property = _property;
        type = _type;

        // for every word found in xml, check if chinese
        checkChinese(word, isChinese);
    });
}

function isChinese() {


    // extract mode
    if (config.getWordMode) {

        if (characterCount > config.characterLimit) {

            createFile("D:\\json\\json" + fileCount + ".txt", string);

            fileCount++;
            string = '';
            chineseFiles = [];

            characterCount = 0;
        }

//                            if (firstChineseOfFile) {

        var shortPath = getShortPath(file);
        chineseFiles.push(new File(shortPath));

//                                var _string = shortPath + '\n';
        var _string = shortPath + '\t';

        characterCount += _string.length;
        string += _string;

        firstChineseOfFile = false;
//                            }

        chineseFiles[chineseFiles.length - 1].Words.push({i: wordCount, w: escapeHtml(word)});

//                            _string = wordCount + '\nw":"' + word + '"\n';
        _string = wordCount + '\t' + word + '\n';

        characterCount += _string.length;
        string += _string;


    }

}

exports.getChinese = getChinese;