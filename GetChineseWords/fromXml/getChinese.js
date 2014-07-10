
function getChinese() {

    walkFile(dirPath, extension, function (contents, file) {

        util.debug(getShortPath(file));

        wordCount = 0;
        var firstChineseOfFile = true;

        xmlParser.parseString(contents, function (err, result) {

            if(err) util.debug(err);

            walkXml(result, function (word, object, property, type) {

                // if end of xml file, write file to disk ONLY IN PUT MODE
                if (word === 'EoF_EoF' && !config.getWordMode) {

                    var builder = new xml2js.Builder({renderOpts: { 'pretty': true, 'indent': '  ', 'newline': '\n' }});
                    var xml = builder.buildObject(result);
//                    util.debug(xml);

                    var xml2 = unescapeHTML(xml);

                    createFile(dirPath+'_output'+getShortPath(file), xml2);
                }

                // for every word found in xml, check if chinese
                checkChinese(word, function (isChinese) {

                    if(isChinese) {

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

                    }else{
                        if(type === 'content'){
                            object[property] = word;
                        }
                    }
                });
            });
        });
        xmlParser.reset();
    });

}

exports.getChinese = getChinese;