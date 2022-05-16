/* eslint-disable no-redeclare */
import axios from 'axios';
import { URL_CATEGORY_SERVER } from '../../constants';
import { updateInfluencer } from '../../services/influencers';
import FacebookUtil from '../../utils/FacebookUtil';
const FB = require('fb');

// This is where a route is handled, the function MUST accept 2 params request and response.
// Request will include all the information of the INCOMING request
// Response will be used to send OUTGOING information

const threeMonthAgo = new Date(
	new Date().getFullYear() - 4,
	new Date().getMonth() - 3,
	new Date().getDate()
);

export default async (req, res) => {
	console.log('connectFacebookController');

	// --------------- Get param to update by facebook api ---------------
	const { access_token, page_id } = req.body;

	console.log({ access_token, page_id });

	let { basic_info, error: error_basic_info } = await get_basic_info(
		access_token,
		page_id
	);
	if (basic_info === null) {
		return res.status(500).json(error_basic_info);
	}

	let facebook_categories = basic_info.category_list.map((cate) => cate.name);

	let { categories, error: error_categories } = await get_categories(
		access_token,
		page_id,
		facebook_categories
	);

	if (categories === null) {
		return res.status(500).json(error_categories);
	}

	let {
		engagement_score,
		post_count,
		error: error_engagement,
	} = await get_engagement(access_token, page_id);
	// !engagement_score sẽ bị rơi vào trường hợp engagement_score = 0
	if (engagement_score === null) {
		return res.status(500).json(error_engagement);
	}

	// let all_comments = await get_all_comments_of_posts(req.body.access_token, req.body.page_id);
	// if(!all_comments) { return res.status(500).json(error);}

	// --------------- Map followers to influencer size ---------------
	// followers -> influencer_size
	let influencer_size = 'Nano';
	if (basic_info.followers_count >= 0 && basic_info.followers_count < 5000) {
		influencer_size = 'Nano';
	} else if (
		basic_info.followers_count >= 5000 &&
		basic_info.followers_count < 25000
	) {
		influencer_size = 'Micro';
	} else if (
		basic_info.followers_count >= 25000 &&
		basic_info.followers_count < 100000
	) {
		influencer_size = 'Small';
	} else if (
		basic_info.followers_count >= 100000 &&
		basic_info.followers_count < 500000
	) {
		influencer_size = 'Medium';
	} else if (
		basic_info.followers_count >= 500000 &&
		basic_info.followers_count < 1000000
	) {
		influencer_size = 'Macro';
	} else if (basic_info.followers_count >= 1000000) {
		influencer_size = 'Mega';
	}

	console.log('influencer_size');
	console.log(influencer_size);

	// --------------- Update Influencer ---------------
	// sentiment
	const { influencer, message } = await updateInfluencer(
		req.body.influencer_id,
		basic_info.name,
		basic_info.link,
		basic_info.followers_count,
		influencer_size,
		categories,
		post_count,
		engagement_score,
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
			console.log('error', error.message);
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
			console.log('error', error.message);
			return { error: error.message, categories: null };
		}
	}
}

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

		console.log('get_engagement2');

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
		console.log('get_engagement3');

		// trung bình cộng
		if (post_count !== 0)
			engagement_score = (engagement_score / post_count).toFixed(2) * 100;
		console.log('engagement_score');
		console.log(engagement_score);
		console.log('get_engagement4');

		return { engagement_score: engagement_score, post_count: post_count };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, engagement_score: null };
		} else {
			console.log('error', error.message);
			return { error: error.message, engagement_score: null };
		}
	}
}

/*
 async function get_all_comments_of_posts(access_token, page_id) {
 	console.log('get_all_comments_of_posts');
 	try {
 		let res = await FB.api(
 			page_id +
 				'/feed?fields=comments.summary(1).filter(stream), created_time, message',
 			{ access_token: access_token }
 		);
 
 		// console.log(JSON.stringify(res, null, 2));
 		console.log(res);
 	} catch (error) {
 		if (error.response.error.code === 'ETIMEDOUT') {
 			console.log('request timeout');
 			return { error: error.response.error, all_comments: null };
 		} else {
 			console.log('error', error.message);
 			return { error: error.message, all_comments: null };
 		}
 	}
 }
  
*/
