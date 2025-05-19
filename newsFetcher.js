const Parser = require('rss-parser');
const parser = new Parser();

async function fetchGoogleNews(keyword) {
    const query = encodeURIComponent(keyword);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;

    try {
        const feed = await parser.parseURL(rssUrl);

        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            originallink: item.link // 도메인 파싱용
        }));
    } catch (err) {
        console.error(`❗ 구글 뉴스 RSS 가져오기 실패 (${keyword}):`, err.message);
        return [];
    }
}

module.exports = { fetchGoogleNews };
