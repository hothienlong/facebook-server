const FB = require('fb');
import { APP_ID, APP_SECRET } from './../../constants';

export default async (req, res) => {
	try {
		const access_token = req.query.access_token;

		console.log({ access_token });

		const longLivedAccessToken = await FB.api('v12.0/oauth/access_token', {
			client_id: APP_ID,
			client_secret: APP_SECRET,
			grant_type: 'fb_exchange_token',
			fb_exchange_token: access_token,
		});

		console.log({ longLivedAccessToken });

		if (!longLivedAccessToken) {
			return res
				.status(500)
				.json('Lấy long lived access token không thành công');
		}

		return res.status(200).json(longLivedAccessToken);
	} catch (error) {
		if (error && error.response) {
			if (error.response.error.code === 'ETIMEDOUT') {
				console.log('request timeout');
				return res.status(500).json(error.response.error);
			} else {
				console.log('error', error.message);
				return res.status(500).json(error.message);
			}
		} else {
			console.log({ error });

			return res.status(500).json(error.message);
		}
	}
};
