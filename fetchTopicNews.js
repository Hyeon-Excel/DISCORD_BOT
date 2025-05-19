// fetchTopicNews.js
const Parser = require('rss-parser');
const parser = new Parser();

const categoryFeeds = {
    대한민국: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFp4WkRNU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko',
    세계: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko',
    비즈니스: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko',
    과학기술: 'https://news.google.com/rss/topics/CAAqKAgKIiJDQkFTRXdvSkwyMHZNR1ptZHpWbUVnSnJieG9DUzFJb0FBUAE?hl=ko&gl=KR&ceid=KR:ko',
    엔터테인먼트: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko',
    스포츠: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko',
    건강: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko'
};

async function fetchTopicNews(categoryKey) {
    const rssUrl = categoryFeeds[categoryKey];
    if (!rssUrl) {
        console.warn(`❗ 알 수 없는 카테고리 키워드: ${categoryKey}`);
        return [];
    }

    try {
        const feed = await parser.parseURL(rssUrl);
        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            originallink: item.link
        }));
    } catch (err) {
        console.error(`❗ RSS 피드 파싱 실패 (${categoryKey}):`, err.message);
        return [];
    }
}

module.exports = { fetchTopicNews };
