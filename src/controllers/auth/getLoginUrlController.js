const FB = require('fb');
import { APP_ID, SCOPE } from './../../constants';

export default async (req, res) => {
	try {
		const redirectUrl = req.body.redirectUrl;

		var resFb = await FB.getLoginUrl({
			client_id: APP_ID,
			scope: SCOPE,
			redirect_uri: redirectUrl,
			display: 'popup',
		});

		console.log(JSON.stringify(resFb));

		if (!resFb || resFb.error) {
			console.log(!res ? 'error occurred' : resFb.error);
			return res.status(500).json(resFb.error);
		}

		return res.status(200).json({ resFb });
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
