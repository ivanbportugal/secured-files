'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa = require('koa');
const jwt = require('koa-jwt');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const filer = require('./filer');

const usersFile = __dirname + '/../users.js';

const secret = process.env.JWT_SECRET || 'jwt_secret';

let registrationActive = process.env.REGISTRATION_ACTIVE || false;

const app = new Koa();

// Custom 401 handling
app.use(async function (ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      let errMessage = err.originalError ?
        err.originalError.message :
        err.message
      ctx.body = {
        error: errMessage
      };
      ctx.set("X-Status-Reason", errMessage)
    } else {
      throw err;
    }
  });
});

app.use(jwt({
  secret: secret,
  debug: true
}).unless({
  path: [/^\/public/, "/"]
}));

app.use(async(ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

if (process.env.NODE_ENV != 'test') {
  app.use(logger());
}
app.use(koaBody());

router.get('/', async(ctx) => {
  ctx.body = 'Hello';
});

function getUsersFromFile() {
  var usersContent = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  return usersContent;
}

function addUser(user) {
  var users = getUsersFromFile();
  users.push(user);
  fs.writeFileSync(usersFile, JSON.stringify(users));
}

/**
 * You can register with:
 * curl -X POST --data '{"username":"thedude", "password":"abides", "email":"thedude@slacker.com", "name":"Mr. Lebowski"}' http://localhost:9000/public/register
 */
router.post('/public/register', async(ctx, next) => {
  if (!ctx.request.body.username || !ctx.request.body.password || !ctx.request.body.email || !ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      error: 'expected an object with username, password, email, name but got: ' + ctx.request.body
    }
    return;
  }

  if (!registrationActive) {
    ctx.status = 403;
    ctx.body = {
      error: 'out of service'
    };
    return;
  }

  ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 5);;
  const users = getUsersFromFile();
  const user = getUserByUsername(ctx.request.body.username, users);
  if (!user) {
    addUser(ctx.request.body);
    ctx.status = 200;
    ctx.body = {
      message: "success"
    };
    next();
  } else {
    ctx.status = 406;
    ctx.body = {
      error: "User exists"
    }
    return;
  }
});

/**
 * You can login with:
 * curl -X POST -H "Content-Type: application/json" --data '{"username":"thedude", "password":"abides"}' http://localhost:9000/public/login
 */
router.post('/public/login', async(ctx, next) => {
  const users = getUsersFromFile();
  let user = await getUserByUsername(ctx.request.body.username, users);
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      error: "bad username"
    }
    return;
  }
  const {
    password,
    ...userInfoWithoutPassword
  } = user;
  if (await bcrypt.compare(ctx.request.body.password, password)) {
    ctx.body = {
      token: jsonwebtoken.sign({
        data: userInfoWithoutPassword
        //exp in seconds
        // exp: Math.floor(Date.now() / 1000) - (60 * 60) // 60 seconds * 60 minutes = 1 hour
      }, secret, {
        expiresIn: '1w'
      })
    };
    next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: "bad password"
    }
    return;
  }
});

function getUserByUsername(username, users) {
  let user;
  for (let i = 0; i < users.length; i++) {
    user = users[i];
    if (user.username === username) {
      return user;
    }
  }
  return null;
}

/**
 * After you login and get a token you can access
 * this (and any other non public endpoint) with:
 * curl -X GET -H "Authorization: Bearer INSERT_TOKEN_HERE" http://localhost:9000/sacred
 */
router.get('/api/v1', async(ctx) => {
  ctx.body = 'Hello ' + ctx.state.user.data.name
});

router.post('/api/v1/registration', async(ctx, next) => {
  const body = ctx.request.body;
  if (body.activate === true) {
    registrationActive = true;
  } else if (body.activate === false) {
    registrationActive = false;
  }

  const users = getUsersFromFile();
  ctx.status = 200;
  ctx.body = {
    items: users.map(user => user.username),
    active: registrationActive
  }
  return;
});

router.get('/api/v1/file-list', async(ctx) => {
  filer.getFileList(ctx);
});

router.get('/api/v1/file', async(ctx) => {
  filer.getFile(ctx);
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;