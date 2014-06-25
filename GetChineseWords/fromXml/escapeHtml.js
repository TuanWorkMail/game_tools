
var entityMap = {
    "&": "&amp;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
    "<": "&lt;",
    ">": "&gt;"
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

exports.escapeHtml = escapeHtml;