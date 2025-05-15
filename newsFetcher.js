require('dotenv').config();
const axios = require('axios');

async function fetchNews(keyword) {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    const res = await axios.get(`https://openapi.naver.com/v1/search/news.json`, {
        params: { query: keyword, display: 1, sort: 'date' },
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        }
    });

    return res.data.items;
}

module.exports = { fetchNews };
