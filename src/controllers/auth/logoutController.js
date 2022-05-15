export default async (req, res) => {
	try {
		console.log('logoutController');
		/*
 		const response = await fetch('https://api.github.com/users/github');
 		const data = await response.json();
 		console.log({ data }); 
*/
		return res.status(200).json({});

		/*
 		const userId = req.body.userId;
 		const fanpageToken = req.body.fanpageToken;
 		const lParams = 'access_token=' + fanpageToken;
 
 		const response = await fetch(
 			'https://graph.facebook.com/' + "1751111915095860" + '/permissions', {
 			method: 'DELETE',
 			body: lParams
 		})
 
 		const jsonData = await response.json(); 
*/
		/*
 		const { jsonData, error } = await sendRequest('DELETE', {
 			url: `${userId}/permissions`,
 			data: JSON.stringify({
 				access_token: fanpageToken,
 			}),
 		}); 
*/

		/*
 		console.log(jsonData);
  
*/
		/*
 		if (!error) return res.status(200).json(jsonData);
 		else return res.status(500).json(error); 
*/
	} catch (error) {
		console.log({ error });

		return res.status(500).json(error.message);
	}
};
