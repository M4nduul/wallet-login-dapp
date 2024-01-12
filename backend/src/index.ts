// import './db';
import cors from 'cors';
import express from 'express';
import { services } from './services';
import dotenv from 'dotenv';
import { sequelize } from './db';
dotenv.config();

const app = express();
const port = process.env.EXPRESS_SERVER_PORT

app.use(express.json());
app.use(cors());
app.use('/api', services);

sequelize.sync().then(() => {
	console.log('DB connected')
	app.listen(port, () =>
		console.log(`Application is running on :${port}`)
	)
}).catch(err => console.error(err))

