import app from './app';
import mongoose from 'mongoose';

// Environment variable on local will be using this to protect secret like API key, credentials
if (!process.env.NODE_ENV) {
	require('dotenv').config();
}

const mongodbURI =
	'mongodb+srv://dbUser:thesishcmut@imansy.taaie.mongodb.net/InmansyDB?retryWrites=true&w=majority';

mongoose.connect(mongodbURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.listen(parseInt(process.env.PORT) || 6900, async () => {
	console.log(`Running on ${process.env.PORT || 6900} port`);
});
