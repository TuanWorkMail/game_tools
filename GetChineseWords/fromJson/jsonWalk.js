function walkJson(json, callback) {

    if(typeof json === 'object'){

        for (var childNode in json) {
            if (json.hasOwnProperty(childNode)) {

                walkJson(json[childNode]);
            }
        }
    }else{

        callback(json);
    }
}

exports.walkJson = walkJson;