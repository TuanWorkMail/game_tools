var beginOfFile = false;

exports.walkJson = function (json, callback) {



    for (var node in json) {
        if (json.hasOwnProperty(node)) {

            var tst = json[node];

            console.log(typeof tst);
        }
    }
};

function walkChildNode(node){

    if(typeof node === 'object'){

        for (var childNode in node) {
            if (node.hasOwnProperty(childNode)) {

                walkChildNode(node[childNode]);
            }
        }
    }else{
        // checkChinese
    }
}