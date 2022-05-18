/* eslint-disable no-redeclare */
import axios from 'axios';
import { ObjectID } from 'bson';
import {
	BRONZE,
	COEF_CAMPAIGN_SCORE,
	COEF_ENGAGEMENT_SCORE,
	COEF_INFLUENCER_SIZE_S,
	COEF_RANK_S,
	COEF_SENTIMENT_SCORE,
	COEF_SOCIAL_SCORE,
	DIAMOND,
	GOLD,
	LIMIT_COMMENT,
	MACRO,
	MACRO_SCORE,
	MEDIUM,
	MEDIUM_SCORE,
	MEGA_SCORE,
	MICRO,
	MICRO_SCORE,
	NANO,
	NANO_SCORE,
	PLATINUM,
	SILVER,
	SMALL,
	SMALL_SCORE,
	URL_CATEGORY_SERVER,
	URL_SERVER_SENTIMENT,
} from '../../constants';
import influencerModel from '../../models/influencers';
import { updateInfluencer } from '../../services/influencers';
import FacebookUtil from '../../utils/FacebookUtil';

const FB = require('fb');

// This is where a route is handled, the function MUST accept 2 params request and response.
// Request will include all the information of the INCOMING request
// Response will be used to send OUTGOING information

// 4 years 3 month
const threeMonthAgo = new Date(
	new Date().getFullYear() - 4,
	new Date().getMonth() - 3,
	new Date().getDate()
);

export default async (req, res) => {
	console.log('connectFacebookController');

	// --------------- Get param to update by facebook api ---------------
	const { access_token, page_id, influencer_id } = req.body;

	console.log({ access_token, page_id, influencer_id });

	// Sentiment score
	let { all_comments, error: errorComments } = await get_all_comments_of_page(
		access_token,
		page_id
	);

	if (!all_comments) {
		return res.status(500).json(errorComments);
	}

	const { sentiment_score, error: errorSentiment } =
		await calculateSentimentScore(all_comments.length, all_comments);

	if (!sentiment_score) {
		return res.status(500).json(errorSentiment);
	}

	// Engagement score
	let {
		engagement_score,
		post_count,
		error: error_engagement,
	} = await get_engagement(access_token, page_id);
	// !engagement_score sẽ bị rơi vào trường hợp engagement_score = 0
	if (engagement_score === null) {
		return res.status(500).json(error_engagement);
	}

	// Basic info
	let { basic_info, error: error_basic_info } = await get_basic_info(
		access_token,
		page_id
	);
	if (basic_info === null) {
		return res.status(500).json(error_basic_info);
	}

	// Get influencer size
	const influencer_size = get_influencer_size(basic_info.followers_count);

	// Category
	let facebook_categories = basic_info.category_list.map((cate) => cate.name);

	let { categories, error: error_categories } = await get_categories(
		access_token,
		page_id,
		facebook_categories
	);

	if (categories === null) {
		return res.status(500).json(error_categories);
	}

	// Get f_score
	const f_score = await calculateFScore(
		convertNumToString(basic_info.followers_count),
		sentiment_score,
		engagement_score
	);
	console.log('f_score', f_score);

	// Get Influencer score
	const { inf_score, error: error_inf_score } = await calculateInfluencerScore(
		influencer_id,
		f_score
	);
	console.log('inf score = ', inf_score);

	if (inf_score === null) {
		return res.status(500).json(error_inf_score);
	}

	// --------------- Update Influencer ---------------
	const { influencer, message } = await updateInfluencer(
		influencer_id,
		basic_info.name,
		basic_info.link,
		basic_info.followers_count,
		influencer_size,
		categories,
		post_count,
		engagement_score,
		sentiment_score,
		f_score,
		inf_score,
		page_id,
		access_token
	);

	if (influencer === null) {
		return res.status(500).json({ message });
	}
	return res.status(200).json(influencer);
};

// name, link, followers_count, category_list
async function get_basic_info(access_token, page_id) {
	console.log('get_basic_info');
	try {
		// lấy tiếng anh để dễ map category
		let res = await FB.api(
			page_id +
				'?fields=id,name,link,picture,followers_count,verification_status,location,category_list&locale=en_US',
			{ access_token: access_token }
		);

		// console.log(res);

		return { basic_info: res };
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, basic_info: null };
		} else {
			console.log('error in get_basic_info', error.message);
			return { error: error.message, basic_info: null };
		}
	}
}

// --------------- Get top 5 categories (primary category: by posts & secondary category: by facebook api) ---------------
async function get_categories(access_token, page_id, facebook_categories) {
	console.log('get_categories');
	try {
		// --------------- Get primary categories ---------------
		let res1 = await FB.api(page_id + '/feed', { access_token: access_token });

		// console.log(res1);
		// luôn đảm bảo try catch phủ lấp
		let posts = [];
		for (let i = 0; i < res1.data.length; i++) {
			if (res1.data[i].message === undefined) continue;
			// console.log(threeMonthAgo - new Date(res1.data[i].created_time));

			// get posts in 3 months ago
			if (threeMonthAgo - new Date(res1.data[i].created_time) > 0) continue;

			posts.push(res1.data[i].message);
		}

		// console.log('posts');
		// console.log(posts);

		// --------------- Get 2 list category ---------------
		console.log({ posts });
		const res2 = await axios({
			method: 'post',
			url: `${URL_CATEGORY_SERVER}/get_categories_with_count`,
			data: { texts: posts },
		});

		// console.log('post categories');
		// console.log(res2.data.categories);
		console.log({ res2 });
		console.log('primary categories');
		let post_categories = res2.data.categories;
		console.log(post_categories);
		console.log('secondary categories');
		let facebook_fanpage_categories =
			FacebookUtil.mapFacebookCategories(facebook_categories);
		console.log(facebook_fanpage_categories);

		// ------- Merge 2 list categories ----------

		for (let key in post_categories) {
			// console.log(key);
			// console.log(post_categories[key]);
			if (facebook_fanpage_categories.includes(key)) {
				post_categories[key] = post_categories[key] * 2;
			}
		}

		// https://www.educative.io/edpresso/how-can-we-sort-a-dictionary-by-value-in-javascript
		// Create items array
		let final_categories = Object.keys(post_categories).map(function (key) {
			return [key, post_categories[key]];
		});

		// console.log('Creating');
		// console.log(final_categories);

		// Sort the array based on the second element
		// Function used to determine the order of the elements.
		// It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise.
		// If omitted, the elements are sorted in ascending, ASCII character order.
		final_categories.sort(function (first, second) {
			return second[1] - first[1];
		});

		// Create a new array with only the first 5 items
		let top_categories = final_categories.slice(0, 5);
		console.log('5 first categories');
		console.log(final_categories.slice(0, 5));

		top_categories = top_categories.map((category) => category[0]);
		console.log('list 5 first categories');
		console.log(top_categories);

		return { categories: top_categories };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, categories: null };
		} else {
			console.log('error in get_categories', error.message);
			return { error: error.message, categories: null };
		}
	}
}

// Get engagement score
async function get_engagement(access_token, page_id) {
	console.log('get_engagement');
	// ko nên dùng hàm callback ở trong hàm async (sẽ ko return đc)
	try {
		let res = await FB.api(
			page_id +
				'/feed?fields=insights.metric(post_impressions_unique,post_engaged_users),message,created_time',
			{ access_token: access_token }
		);

		console.log(res.data);

		let engagement_score = 0;
		let post_count = 0;

		for (let i = 0; i < res.data.length; i++) {
			// console.log(threeMonthAgo - new Date(res.data[i].created_time));

			// get insight in 3 months ago
			if (threeMonthAgo - new Date(res.data[i].created_time) > 0) continue;

			let reach = res.data[i].insights.data[0].values[0].value;
			let engaged_user = res.data[i].insights.data[1].values[0].value;

			// mẫu khác 0
			if (reach === 0) continue;

			// console.log(engaged_user + ' ' + reach);

			// luôn bé hơn 1
			engagement_score = engagement_score + engaged_user / reach;

			post_count++;
			// console.log(engaged_user / reach);

			// console.log(engagement_score);
		}

		// trung bình cộng
		if (post_count !== 0)
			engagement_score = (engagement_score / post_count).toFixed(2) * 100;
		console.log('engagement_score');
		console.log(engagement_score);

		return { engagement_score: engagement_score, post_count: post_count };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, engagement_score: null };
		} else {
			console.log('error in get_engagement', error.message);
			return { error: error.message, engagement_score: null };
		}
	}
}

// Get all comments of page
async function get_all_comments_of_page(access_token, page_id) {
	console.log('get_all_comments_of_page');
	try {
		let res = await FB.api(
			page_id +
				'/feed?fields=comments.summary(1).filter(stream), created_time, message',
			{ access_token: access_token }
		);

		// console.log(JSON.stringify(res, null, 2));
		console.log(res.data);

		let comments = [];

		for (let i = 0; i < res.data.length; i++) {
			// console.log(threeMonthAgo - new Date(res.data[i].created_time));

			// get insight in 3 months ago
			if (threeMonthAgo - new Date(res.data[i].created_time) > 0) continue;

			let messageOfAPost = res?.data[i]?.comments?.data?.map(
				(cmt) => cmt?.message
			);

			comments = comments.concat(messageOfAPost);
		}

		return { all_comments: comments };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, all_comments: null };
		} else {
			console.log('error in get_all_comments_of_page', error.message);
			return { error: error.message, all_comments: null };
		}
	}
}

// Get sentiment score
export const calculateSentimentScore = async (size, comments) => {
	try {
		let page = 0;
		let pos = 0;
		let neu = 0;
		// lấy từng đợt để khỏi bị quá tải
		while (page * LIMIT_COMMENT < size) {
			const temp = comments.slice(
				page * LIMIT_COMMENT,
				(page + 1) * LIMIT_COMMENT
			);
			const res = await axios.post(
				`${URL_SERVER_SENTIMENT}/analyze_sentiment`,
				{
					comments: temp,
				},
				{
					withCredentials: true,
				}
			);
			console.log(
				'calculate sentiment page ',
				page,
				'pos: ',
				res.data.pos,
				'neu: ',
				res.data.neu
			);
			pos = pos + res.data.pos;
			neu = neu + res.data.neu;
			page = page + 1;
		}
		// await deleteComments(email);
		console.log('total pos neu', pos, neu);
		return { sentiment_score: parseInt(((pos + (1 / 2) * neu) / size) * 100) };
	} catch (error) {
		console.log('error in calculateSentimentScore: ', error);
		return { sentiment_score: null, error: error.message };
	}
};

// Get Influencer score
const calculateInfluencerScore = async (influencer_id, fScore) => {
	try {
		const data = await influencerModel.findOne({
			_id: ObjectID(influencer_id),
		});
		if (data) {
			const socialNetwork = data.social_network;
			let socialScore = 0;
			let totalError = 0; // cac lien ket mang xa hoi bi loi
			const campaignRating = data.campaign_rating
				? data.campaign_rating * 10
				: 0;
			console.log('campaignRating = ', campaignRating);
			for (let i in socialNetwork) {
				if (
					socialNetwork[i].channel_name !== 'youtube' &&
					!socialNetwork[i].error_link
				)
					socialScore += socialNetwork[i].fScore ? socialNetwork[i].fScore : 0;
				else if (socialNetwork[i].error_link) totalError = totalError + 1;
				else socialScore += fScore;
			}
			socialScore =
				socialScore == 0
					? 0
					: socialScore / (socialNetwork.length - totalError);
			console.log('social score = ', socialScore);
			const rankS = calculateRankScore(data.user_detail.rank);
			console.log('rankS = ', rankS);
			return {
				inf_score:
					Math.round(
						(socialScore * COEF_SOCIAL_SCORE +
							campaignRating * COEF_CAMPAIGN_SCORE +
							rankS * COEF_RANK_S) *
							100
					) / 100,
			};
		}
	} catch (error) {
		console.log('error in calculateInfluencerScore', error);
		return { inf_score: null, error: error.message };
	}
};

// --------------- Map followers to influencer size ---------------
const get_influencer_size = function (followers) {
	// followers -> influencer_size
	let influencer_size = 'Nano';
	if (followers >= 0 && followers < 5000) {
		influencer_size = 'Nano';
	} else if (followers >= 5000 && followers < 25000) {
		influencer_size = 'Micro';
	} else if (followers >= 25000 && followers < 100000) {
		influencer_size = 'Small';
	} else if (followers >= 100000 && followers < 500000) {
		influencer_size = 'Medium';
	} else if (followers >= 500000 && followers < 1000000) {
		influencer_size = 'Macro';
	} else if (followers >= 1000000) {
		influencer_size = 'Mega';
	} else {
		influencer_size = 'Nano';
	}

	console.log('influencer_size');
	console.log(influencer_size);
	return influencer_size;
};

// calculateFScore
const calculateFScore = async function (size, sentimentScore, engagementScore) {
	try {
		const influencerSizeS = convertInfluencerSize(size);

		const k =
			influencerSizeS * COEF_INFLUENCER_SIZE_S +
			COEF_SENTIMENT_SCORE * sentimentScore +
			COEF_ENGAGEMENT_SCORE * engagementScore;
		return Math.round(k * 100) / 100;
	} catch (error) {
		console.log('error in calculateFScore', error);
		return 0;
	}
};

// convertInfluencerSize
const convertInfluencerSize = (size) => {
	switch (size) {
		case 'Mega':
			return MEGA_SCORE;
		case 'Macro':
			return MACRO_SCORE;
		case 'Medium':
			return MEDIUM_SCORE;
		case 'Small':
			return SMALL_SCORE;
		case 'Micro':
			return MICRO_SCORE;
		case 'Nano':
			return NANO_SCORE;
		default:
			return 0;
	}
};

// calculateRankScore
const calculateRankScore = (rank) => {
	switch (rank) {
		case 'Bronze':
			return BRONZE;
		case 'Silver':
			return SILVER;
		case 'Gold':
			return GOLD;
		case 'Platinum':
			return PLATINUM;
		case 'Diamond':
			return DIAMOND;
		default:
			return 0;
	}
};

const convertNumToString = (num) => {
	if (num <= NANO) return 'Nano';
	else if (num < MICRO) return 'Micro';
	else if (num < SMALL) return 'Small';
	else if (num < MEDIUM) return 'Medium';
	else if (num < MACRO) return 'Macro';
	else return 'Mega';
};
