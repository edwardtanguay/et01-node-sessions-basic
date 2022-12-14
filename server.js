import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3024;
dotenv.config();

app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET
	})
);
app.use(cookieParser());

const users = [
	{
		username: 'ja',
		firstName: 'Jörg',
		lastName: 'Ackermann',
		email: 'ja@mail.com',
	},
	{
		username: 'ac',
		firstName: 'Angelika',
		lastName: 'Carstense',
		email: 'ac@mail.com',
	},
];

app.get('/', (req, res) => {
	res.send('session/cookie basic test');
});

app.get('/login/:username', (req, res) => {
	const user = users.find((user) => user.username === req.params.username);
	if (user) {
		req.session.user = user;
		req.session.cookie.expires = new Date(Date.now() + 10000); // 10 seconds
		req.session.save();
		res.send(`User logged in: ${JSON.stringify(user)}`);
	} else {
		res.status(500).send('bad login');
	}
});

app.get('/current-user', (req, res) => {
	if (req.session.user) {
		res.send(req.session.user);
	} else {
		res.send('no user logged in');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		res.send('User logged out');
	});
});

app.listen(PORT, () => {
	console.log(`listening at http://localhost:${PORT}`);
});
