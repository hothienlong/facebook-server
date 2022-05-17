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

export const LIMIT_COMMENT = 50; // số lượng cmt từng đợt gửi lên sentiment server
