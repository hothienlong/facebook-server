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
		let {
			reaction_count,
			reaction_value,
			error: errorReactionOfPost,
		} = await get_reaction_of_post(access_token, post_id);
		console.log({ reaction_value });
		if (reaction_count === null) {
			return res.status(500).json(errorReactionOfPost);
		}
		console.log('reaction_count: ' + reaction_count);

		let {
			comment_count,
			comment_value,
			error: errorCommentsOfPost,
		} = await get_comments_of_post(access_token, post_id);
		console.log({ comment_value });

		if (comment_count === null) {
			return res.status(500).json(errorCommentsOfPost);
		}
		console.log('comment_count: ' + comment_count);

		let { share_count, error: errorShareOfPost } = await get_share_of_post(
			access_token,
			post_id
		);
		if (share_count === null) {
			return res.status(500).json(errorShareOfPost);
		}
		console.log('share_count: ' + share_count);

		let { engagement_score, error: errorEngagement } = await get_engagement(
			access_token,
			post_id
		);
		if (engagement_score === null) {
			return res.status(500).json(errorEngagement);
		}
		// console.log(JSON.stringify(res_engagement));

		return res.status(200).json({
			reaction_count: reaction_count,
			comment_count: comment_count,
			share_count: share_count,
			engagement_score: engagement_score,
		});
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
};

// return reaction_value null if no reaction
async function get_reaction_of_post(access_token, post_id) {
	console.log('get_reaction_of_post');
	try {
		let res_reaction = await FB.api(
			// post thông tin thầy
			// '1912266269065309_1938674479757821' +
			post_id + '/insights?metric=post_reactions_by_type_total',
			{ access_token: access_token }
		);

		console.log(JSON.stringify(res_reaction));
		// console.log(res_reaction[0].values[0].value);

		// console.log(res);
		let reaction_value = res_reaction.data[0].values[0].value;
		if (!reaction_value) {
			console.log(reaction_value); // check "", null, undefined, {}
			throw new Error('Reaction value is undefined or null');
		}
		// ??: check undefined
		let reaction_count =
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
		let res_comment = await FB.api(
			// '1912266269065309_1938674479757821' +
			post_id + '/comments?summary=1&filter=stream',
			{ access_token: access_token }
		);

		// console.log(JSON.stringify(res_comment));

		let comment_value = res_comment.data;
		if (comment_value.length === 0) {
			comment_value = null;
		}

		// console.log(comment_value);
		let comment_count = res_comment.summary.total_count;
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
		// tùy post sẽ có share hoặc ko
		let res_share = await FB.api(post_id + '?fields=shares', {
			access_token: access_token,
		});

		console.log(JSON.stringify(res_share));

		if (!res_share.shares || !res_share.shares.count) return { share_count: 0 };

		let share_count = res_share.shares.count;

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
	console.log({
		access_token,
		post_id,
	});
	// ko nên dùng hàm callback ở trong hàm async (sẽ ko return đc)
	try {
		const res_engagement = await FB.api(
			post_id + '/insights?metric=post_impressions_unique,post_engaged_users',
			{ access_token: access_token }
		);

		console.log({ res_engagement });

		// console.log(JSON.stringify(res_engagement));

		let engagement_score = 0;

		let reach = res_engagement.data[0].values[0].value;
		let engaged_user = res_engagement.data[1].values[0].value;

		// luôn bé hơn 1
		if (reach !== 0) engagement_score = engaged_user / reach;

		engagement_score = engagement_score.toFixed(2) * 100;
		console.log(engagement_score);

		return { engagement_score: engagement_score };
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
