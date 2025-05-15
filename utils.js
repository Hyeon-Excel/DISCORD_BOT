function stripHtml(str) {
    return str.replace(/<[^>]*>?/g, '');
}
module.exports = { stripHtml };
