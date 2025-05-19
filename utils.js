function decodeEntities(text) {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#039;/g, "'"); // 일부 API는 &#039;를 작은따옴표로 사용
}

function stripHtml(str) {
    return str.replace(/<[^>]*>?/g, '');
}

module.exports = { stripHtml };