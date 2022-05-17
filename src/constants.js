export const APP_ID = '1093184171468667';
export const APP_SECRET = '0bd71fa631faa58d956222d426f0d0cb';
export const ROOT_API = 'https://graph.facebook.com';
export const URL_CATEGORY_SERVER = 'http://127.0.0.1:1000';
//'https://classification-server-inmansy.herokuapp.com';

export const URL_SERVER_SENTIMENT =
	'https://sentiment-server-inmansy.herokuapp.com';

// export const PAGE_ID = '1912266269065309';

// export const URL_HEROKU_SENTIMENT = "https://server-inmansy.herokuapp.com"

export const INFLUENCER_SIZE = {
	Nano: 1,
	Micro: 2,
	Small: 3,
	Medium: 4,
	Macro: 5,
	Mega: 6,
};

export const LIST_CATEGORIES = {
	amnhac: 'Âm nhạc',
	do_cong_nghe: 'Đồ công nghệ',
	dulich: 'Du lịch',
	game: 'Game',
	nhacua_doisong: 'Nhà cửa và đời sống',
	sacdep_phukien: 'Sắc đẹp và phụ kiện',
	sach_tapchi: 'Giáo dục',
	sinhly: 'Sinh lý',
	thethao: 'Thể thao',
	thoitrang: 'Thời trang',
	thucpham_douong: 'Ăn uống',
};

export const SCOPE = [
	'public_profile',
	'email',
	'read_insights',
	'pages_read_engagement',
	'user_posts',
	'pages_manage_posts',
];

export const NANO = 4999;
export const MICRO = 24999;
export const SMALL = 99999;
export const MEDIUM = 499999;
export const MACRO = 999999;
export const MEGA_SCORE = 100;
export const MACRO_SCORE = 90;
export const MEDIUM_SCORE = 80;
export const SMALL_SCORE = 70;
export const MICRO_SCORE = 60;
export const NANO_SCORE = 50;
export const COEF_INFLUENCER_SIZE_S = 0.2;
export const COEF_SENTIMENT_SCORE = 0.4;
export const COEF_ENGAGEMENT_SCORE = 0.4;
export const BRONZE = 50;
export const SILVER = 60;
export const GOLD = 70;
export const PLATINUM = 85;
export const DIAMOND = 100;
export const COEF_SOCIAL_SCORE = 0.6;
export const COEF_CAMPAIGN_SCORE = 0.3;
export const COEF_RANK_S = 0.1;
export const LIMIT_COMMENT = 50; // số lượng cmt từng đợt gửi lên sentiment server
