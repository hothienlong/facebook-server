/* eslint-disable no-redeclare */
import { updateInfluencer } from '../../services/influencers';
import { PAGE_ID } from '../../constants';
const FB = require('fb');
import axios from 'axios';

// This is where a route is handled, the function MUST accept 2 params request and response.
// Request will include all the information of the INCOMING request
// Response will be used to send OUTGOING information

export default async (req, res) => {
	console.log('updateInfluencerController');
	console.log(PAGE_ID);

	var { engagement_score, error } = await calculate_engagement(
		req.body.access_token
	);
	if (!engagement_score) {
		return res.status(500).json(error);
	}

	var { basic_info, error } = await get_basic_info(req.body.access_token);
	if (!basic_info) {
		return res.status(500).json(error);
	}

	var { categories, error } = await get_categories(req.body.access_token);
	if (!categories) {
		return res.status(500).json(error);
	}

	// var all_comments = await get_all_comments_of_posts(req.body.access_token);
	// if(!all_comments) { return res.status(500).json(error);}

	// followers -> influencer_size
	var influencer_size = 'Nano';
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

	// sentiment, category
	const { influencer, status, message } = await updateInfluencer(
		req.body.influencer_id,
		basic_info.name,
		basic_info.link,
		basic_info.followers_count,
		engagement_score,
		influencer_size
	);

	if (!status) {
		return res.status(500).json({ message });
	}
	return res.status(200).json(influencer);
};

// name, link, followers_count, category_list
async function get_basic_info(access_token) {
	try {
		var res = await FB.api(
			PAGE_ID +
				'?fields=id,name,link,picture,followers_count,verification_status,location,category_list',
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

async function get_categories(access_token) {
	try {
		var res1 = await FB.api(PAGE_ID + '/feed', { access_token: access_token });

		// console.log(res1);

		// return res1;
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error };
		} else {
			console.log('error', error.message);
			return { error: error.message };
		}
	}

	var posts = [];
	for (let i = 0; i < res1.data.length; i++) {
		if (res1.data[i].message !== undefined) posts.push(res1.data[i].message);
	}

	// console.log(posts);

	const res2 = await axios({
		method: 'post',
		url: `http://localhost:1000/get_categories`,
		data: { texts: posts },
	});

	console.log(res2.data.categories);

	return res2.data.categories;
}

async function calculate_engagement(access_token) {
	// ko nên dùng hàm callback ở trong hàm async (sẽ ko return đc)
	try {
		var res = await FB.api(
			PAGE_ID +
				'/feed?fields=insights.metric(post_impressions_unique,post_engaged_users),message',
			{ access_token: access_token }
		);

		// console.log(res);
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, engagement_score: null };
		} else {
			console.log('error', error.message);
			return { error: error.message, engagement_score: null };
		}
	}

	var engagement_score = 0;

	for (let i = 0; i < res.data.length; i++) {
		var reach = res.data[i].insights.data[0].values[0].value;
		var engaged_user = res.data[i].insights.data[1].values[0].value;

		// mẫu khác 0
		if (reach !== 0)
			// luôn bé hơn 1
			engagement_score = engagement_score + engaged_user / reach;
		// console.log("reach: " + reach);
		// console.log(engaged_user / reach);

		// console.log(engagement_score);
	}

	// trung bình cộng
	if (res.data.length !== 0)
		engagement_score = (engagement_score / res.data.length) * 100;
	console.log('engagement_score');
	console.log(engagement_score);

	return { engagement_score: engagement_score };
}

async function get_all_comments_of_posts(access_token) {
	try {
		var res = await FB.api(
			PAGE_ID +
				'/feed?fields=comments.summary(1).filter(stream), created_time, message',
			{ access_token: access_token }
		);

		// console.log(JSON.stringify(res, null, 2));
		// console.log(res);
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
