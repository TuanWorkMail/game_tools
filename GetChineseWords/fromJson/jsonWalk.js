function walkJson(json, callback) {

    if(typeof json === 'object'){

        for (var childNode in json) {
            if (json.hasOwnProperty(childNode)) {

                if(typeof json[childNode] === 'object'){
                    walkJson(json[childNode], callback);
                } else {
                    callback(json[childNode], json, childNode);
                }
            }
        }
    }
}

exports.walkJson = walkJson;