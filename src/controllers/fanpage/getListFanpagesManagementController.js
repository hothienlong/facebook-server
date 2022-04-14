const FB = require('fb');

export default async (req, res) => {
	console.log('getListFanpagesManagementController');

	const access_token = req.query.access_token;

	try {
		let resFb = await FB.api('me/accounts?access_token=' + access_token);

		console.log({ resFb });

		if (!resFb) {
			return res.status(500).json('Lấy danh sách fanpage không thành công.');
		}

		return res.status(200).json(resFb);
	} catch (error) {
		if (error.response.error.code === 'ETIMEDOUT') {
			console.log('request timeout');
			return res.status(500).json({ message: error.response.error });
		} else {
			console.log('error', error.message);
			return res.status(500).json({ message: error.message });
		}
	}
};
