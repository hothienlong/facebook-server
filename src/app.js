import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use('/', router);

export default app;
