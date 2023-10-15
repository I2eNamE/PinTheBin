const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

// Middleware
const authRegister = require('./routes/authRegister');
// const authLogout = require('./routes/authLogout');
// const authLogin = require('./routes/authLogin');
// const authCheck = require('./routes/authCheck');

// CORS
let allowlist = ['http://example1.com', 'http://example2.com']
let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use('*', cors({
    origin: 'https://pinthebin.vercel.app/',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
}));

app.use('/imageData',express.static('uploads'))
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
// app.use(bodyParser. text({type: '/'}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.secretKey,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
        sameSite: 'Strict',
    },
    name: 'pinthebin-cookie'
}));

app.get('/', (req, res) => {
    res.redirect('/home.html');
});

// Auth Routing
app.use('/auth/register', authRegister);
// app.use('/auth/logout', authLogout);
// app.use('/auth/login', authLogin);
// app.use('/auth/check', authCheck);

// Profile info
// app.use('/profile/info', userInfo);
// app.use('/profile/edit', profEdit);
// app.use('/profile/delete', profDelete);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        ok: false,
        error: 'Internal Server Error :/'
    });
});

app.listen(port, () => {
    console.log(`API is listening on port ${port}`)
});