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

function extractPressName(originallink) {
    if (!originallink) return '언론사 미상';
    try {
        const domain = new URL(originallink).hostname;

        const pressMap = {
            //종합
            'www.khan.co.kr': '경향신문',
            'www.kmib.co.kr': '국민일보',
            'www.donga.com': '동아일보',
            'www.munhwa.com': '문화일보',
            'www.seoul.co.kr': '서울신문',
            'www.segye.com': '세계일보',
            'www.chosun.com': '조선일보',
            'www.joongang.co.kr': '중앙일보',
            'www.hani.co.kr': '한겨레',
            'www.hankookilbo.com': '한국일보',
            //방송/통신
            'www.news1.kr': '뉴스1',
            'www.newsis.com': '뉴시스',
            'www.yna.co.kr': '연합뉴스',
            'www.yonhapnewstv.co.kr': '연합뉴스TV',
            'www.ichannela.com': '채널A',
            'www.hankyung.com': '한국경제TV',
            'www.jtbc.co.kr': 'JTBC',
            'news.kbs.co.kr': 'KBS',
            'imnews.imbc.com': 'MBC',
            'www.mbn.co.kr': 'MBN',
            'news.sbs.co.kr': 'SBS',
            'www.sbsbiz.co.kr': 'SBS biz',
            'www.tvchosun.com': 'TV조선',
            'news.ytn.co.kr': 'YTN',
            //경제
            'www.mk.co.kr': '매일경제',
            'www.mt.co.kr': '머니투데이',
            'www.sedaily.com': '서울경제',
            'www.asiae.co.kr': '아시아경제',
            'www.edaily.co.kr': '이데일리',
            'www.chosunbiz.com': '조선비즈',
            'www.joseilbo.com': '조세일보',
            'www.fnnews.com': '파이낸셜뉴스',
            'www.hankyung.com': '한국경제',
            'www.heraldcorp.com': '헤럴드경제',
            //인터넷
            'www.nocutnews.co.kr': '노컷뉴스',
            'www.thefact.com': '더팩트',
            'www.dailian.co.kr': '데일리안',
            'www.moneys.co.kr': '머니S',
            'www.mediatoday.co.kr': '미디어오늘',
            'www.inews24.com': '아이뉴스24',
            'www.ohmynews.com': '오마이뉴스',
            'www.pressian.com': '프레시안',
            //IT 
            'www.ddaily.co.kr': '디지털데일리',
            'www.dt.co.kr': '디지털타임스',
            'www.bloter.net': '블로터',
            'www.etnews.com': '전자신문',
            'www.zdnet.co.kr': '지디넷코리아',
            //매거진
            'www.thescoop.co.kr': '더스쿠프',
            'www.lady.khan.co.kr': '레이디경향',
            'www.mk.co.kr': '매경이코노미',
            'www.sisain.co.kr': '시사IN',
            'www.sisapress.com': '시사저널',
            'www.donga.com': '신동아',
            'www.mountainkorea.com': '월간 산',
            'www.economist.co.kr': '이코노미스트',
            'www.khan.co.kr': '주간경향',
            'www.donga.com': '주간동아',
            'www.chosun.com': '주간조선',
            'www.joongang.co.kr': '중앙Sunday',
            'www.hani.co.kr': '한겨레21',
            'www.hankyung.com': '한경BUSINESS',
            //전문지
            'www.journalist.or.kr': '기자협회보',
            'www.nongmin.com': '농민신문',
            'www.newstapa.org': '뉴스타파',
            'www.dongascience.com': '동아사이언스',
            'www.womennews.co.kr': '여성신문',
            'www.ildaro.com': '일다',
            'www.koreadaily.com': '코리아중앙데일리',
            'www.koreaherald.com': '코리아헤럴드',
            'www.koreamed.com': '코메디닷컴',
            'www.health.chosun.com': '헬스조선',
            //지역
            'www.kado.net': '강원도민일보',
            'www.kwnews.co.kr': '강원일보',
            'www.kgnews.co.kr': '경기일보',
            'www.kookje.co.kr': '국제신문',
            'www.daegu.co.kr': '대구MBC',
            'www.daejonilbo.com': '대전일보',
            'www.imaeil.com': '매일신문',
            'www.busan.com': '부산일보',
            'www.jjmbc.co.kr': '전주MBC',
            'www.cjbtv.co.kr': 'CJB청주방송',
            'www.jlb.co.kr': 'JLBS',
            'www.kbc.co.kr': 'kbc광주방송',
            //포토
            'www.xinhuanet.com': '신화사 연합뉴스',
            'www.ap.org': 'AP연합뉴스',
            'www.epa.eu': 'EPA연합뉴스',
            // 필요 시 추가 가능
        };

        return pressMap[domain] || domain;
    } catch {
        return '언론사 미상';
    }
}

module.exports = { stripHtml, extractPressName };