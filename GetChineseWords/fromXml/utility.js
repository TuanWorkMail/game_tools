function getShortPath(path, dirPath){
    return path.replace(dirPath, '');
}
exports.getShortPath = getShortPath;

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
exports.createFile = createFile;