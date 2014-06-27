var beginOfFile = false;

exports.walkXml = function (result, callback) {
    // first go into the root node
    for (var rootNode in result) {
        if (result.hasOwnProperty(rootNode)) {

            beginOfFile = true;
            walkAllChildNode(result[rootNode], callback);
        }
    }
};

function walkAllChildNode(result, callback) {

    var _beginOfFile = false;

    if (beginOfFile) {
        beginOfFile = false;
        _beginOfFile = true;
    }

    // walk all content of the same tag
    for (var i = 0; i < result.length; i++) {

        // check content inside the tag
        if (typeof result[i] === 'object') {

            // walk into each tag of  root xml tag
            for (var _node in result[i]) {
                if (result[i].hasOwnProperty(_node)) {

                    var node = result[i][_node];

                    // check properties of tag
                    if (_node === '$') {

                        for (var attribute in node) {
                            if (node.hasOwnProperty(attribute)) {

                                callback(node[attribute], node, attribute, 'attribute');
                            }
                        }

                    } else if (_node === '_') {
                        callback(node, result[i], '_', 'content');
                    } else {

                        // walk into child node
                        for (var childNode in node) {
                            if (node.hasOwnProperty(childNode)) {

                                walkAllChildNode(node, callback);

                            }
                        }

                    }
                }
            }

        } else {
            callback(result[i], result, i, 'content');
        }


    }

    // check end of file
    if (_beginOfFile) {
        callback('EoF_EoF');
    }
}