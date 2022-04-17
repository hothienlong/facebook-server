const FB = require('fb');
import { APP_ID, APP_SECRET } from './../../constants';

export default async (req, res) => {
	try {
		const accessToken = await FB.api('oauth/access_token', {
			client_id: APP_ID,
			client_secret: APP_SECRET,
			grant_type: 'client_credentials',
		});

		console.log(accessToken);

		return res.status(200).json(accessToken);
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
