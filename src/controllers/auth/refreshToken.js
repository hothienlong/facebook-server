const FB = require('fb');

export default async (req, res) => {
	try {
		var resFb = await FB.api('oauth/access_token', {
			client_id: req.body.client_id,
			client_secret: req.body.client_secret,
			grant_type: 'fb_exchange_token',
			fb_exchange_token: req.body.existing_access_token,
		});

		console.log(resFb);

		if (!resFb || resFb.error) {
			console.log(!res ? 'error occurred' : resFb.error);
			return res.status(500).json(resFb.error);
		}

		var accessToken = resFb.access_token;
		var expires = resFb.expires_in ? resFb.expires_in : 0;
		console.log(accessToken);

		return res.status(200).json({ accessToken, expires });
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return res.status(500).json(error.response.error);
		} else {
			console.log('error', error.message);
			return res.status(500).json(error.message);
		}
	}
};
