/* eslint-disable no-redeclare */
const FB = require('fb');

// sẽ có một số field không có (vd: share=0 thì sẽ không có field share)
export default async (req, res) => {
	console.log('getPostEngagementController');
	const post_id = req.query.post_id;
	const access_token = req.query.access_token;
	// console.log('post_id: ' + post_id);
	// console.log('access_token: ' + access_token);

	// ko nên dùng hàm callback ở trong hàm async (sẽ ko return đc)
	try {
		var { reaction_count, reaction_value, error } = await get_reaction_of_post(
			access_token,
			post_id
		);
		console.log({ reaction_value });
		if (reaction_count === null) {
			return res.status(500).json(error);
		}
		console.log('reaction_count: ' + reaction_count);

		var { comment_count, comment_value, error } = await get_comments_of_post(
			access_token,
			post_id
		);
		console.log({ comment_value });

		if (comment_count === null) {
			return res.status(500).json(error);
		}
		console.log('comment_count: ' + comment_count);

		var { share_count, error } = await get_share_of_post(access_token, post_id);
		if (share_count === null) {
			return res.status(500).json(error);
		}
		console.log('share_count: ' + share_count);

		var { engagement_score, error } = await get_engagement(
			access_token,
			post_id
		);
		if (engagement_score === null) {
			return res.status(500).json(error);
		}
		// console.log(JSON.stringify(res_engagement));
	} catch (error) {
		if (error.response === undefined) {
			console.log(error);
			return { error: error };
		}
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, engagement_score: null };
		} else {
			console.log('error', error.message);
			return { error: error.message, engagement_score: null };
		}
	}

	return res.status(200).json({
		reaction_count: reaction_count,
		comment_count: comment_count,
		share_count: share_count,
		engagement_score: engagement_score,
	});
};

// return reaction_value null if no reaction
async function get_reaction_of_post(access_token, post_id) {
	console.log('get_reaction_of_post');
	try {
		var res_reaction = await FB.api(
			// '1912266269065309_2463196983972232' +
			post_id + '/insights?metric=post_reactions_by_type_total',
			{ access_token: access_token }
		);

		console.log(JSON.stringify(res_reaction));
		// console.log(res_reaction[0].values[0].value);

		// console.log(res);
		var reaction_value = res_reaction.data[0].values[0].value;
		if (!reaction_value) console.log(reaction_value); // check "", null, undefined, {}

		// ??: check undefined
		var reaction_count =
			(reaction_value.like ?? 0) +
			(reaction_value.love ?? 0) +
			(reaction_value.wow ?? 0) +
			(reaction_value.haha ?? 0) +
			(reaction_value.sorry ?? 0) +
			(reaction_value.anger ?? 0);

		console.log(reaction_count);

		return { reaction_count: reaction_count, reaction_value: reaction_value };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return {
				error: error.response.error,
				reaction_count: null, /// reaction_value có thể null nếu không có reaction
			};
		} else {
			console.log('error', error.message);
			return {
				error: error.message,
				reaction_count: null,
			};
		}
	}
}

// return comment_value null if no comments
async function get_comments_of_post(access_token, post_id) {
	console.log('get_comments_of_post');
	try {
		var res_comment = await FB.api(
			// '1912266269065309_2463196983972232' +
			post_id + '/comments?summary=1&filter=stream',
			{ access_token: access_token }
		);

		// console.log(JSON.stringify(res_comment));

		var comment_value = res_comment.data;
		if (comment_value.length === 0) {
			comment_value = null;
		}

		// console.log(comment_value);
		var comment_count = res_comment.summary.total_count;
		// console.log(comment_count);

		return { comment_value: comment_value, comment_count: comment_count };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return {
				error: error.response.error,
				comment_count: null, /// comment_count có thể null / {} nếu không có comment
			};
		} else {
			console.log('error', error.message);
			return {
				error: error.message,
				comment_count: null,
			};
		}
	}
}

// return comment_value null if no comments
async function get_share_of_post(access_token, post_id) {
	console.log('get_comments_of_post');
	try {
		var res_share = await FB.api(post_id + '?fields=shares', {
			access_token: access_token,
		});

		console.log(JSON.stringify(res_share));

		if (res_share.shares === undefined) return { share_count: 0 };

		var share_count = res_share.shares.count;

		// console.log(JSON.stringify(res_comment));

		return { share_count: share_count };
	} catch (error) {
		console.log(error);
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return {
				error: error.response.error,
				share_count: null, /// share_count có thể null / {} nếu không có share
			};
		} else {
			console.log('error', error.message);
			return {
				error: error.message,
				share_count: null,
			};
		}
	}
}

async function get_engagement(access_token, post_id) {
	console.log('get_engagement');
	// ko nên dùng hàm callback ở trong hàm async (sẽ ko return đc)
	try {
		var res_engagement = await FB.api(
			post_id + '/insights?metric=post_impressions_unique,post_engaged_users',
			{ access_token: access_token }
		);

		// console.log(JSON.stringify(res_engagement));

		var engagement_score = 0;

		var reach = res_engagement.data[0].values[0].value;
		var engaged_user = res_engagement.data[1].values[0].value;

		// luôn bé hơn 1
		if (reach !== 0) engagement_score = engaged_user / reach;

		engagement_score = engagement_score.toFixed(2) * 100;
		console.log('engagement_score');
		console.log(engagement_score);

		return { engagement_score: engagement_score };
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return { error: error.response.error, engagement_score: null };
		} else {
			console.log('error', error.message);
			return { error: error.message, engagement_score: null };
		}
	}
}
