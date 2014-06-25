exports.walkXml = function(result, callback){
    // first go into the root node
    for (var rootNode in result) {
        if (result.hasOwnProperty(rootNode)) {

            walkAllChildNode(result[rootNode], callback);


        }
    }
};

function walkAllChildNode(result, callback) {

    // walk into each tag of  root xml tag
    for (var _node in result) {
        if (result.hasOwnProperty(_node)) {

            // walk all content of the same tag
            for (var i = 0; i < result[_node].length; i++) {
                var node = result[_node][i];

                // check content inside the tag
                if (typeof node === 'object') {

                    // check properties of tag
                    if(node.$) {
                        for (var property in node.$) {
                            if (node.$.hasOwnProperty(property)) {

                                callback(node.$[property]);
                            }
                        }
                    }
                    if (node._) {
                        callback(node._);
                    }
                    // walk into child node
                    for (var childNode in node) {
                        if (node.hasOwnProperty(childNode)) {

                            if (childNode !== '$' && typeof node[childNode] === 'object') {
                                walkAllChildNode(node, callback);
                            }
                        }
                    }
                } else {
                    callback(node);
                }
            }
        }
    }
}