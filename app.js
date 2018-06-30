var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var path = require('path')

var pokedex = require('./pokedex.json')

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function validateRequired(value) {
  if (value === undefined) return false;
  if (value === null) return false;
  if (String(value).trim().length === 0) return false;

  return true;
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  return password.length > 3;
}

function requiredLoggedMiddleware(req, res, next) {
  var token = req.headers.authorization;

  var authenticated = users.find(function (u) {
    return u.token === token;
  })

  if (!authenticated) {
    return next(createError(401, 'Not authorized.'));
  }

  next();
}

let users = [
  {
    email: 'ben-hur@cwi.com.br',
    password: '1234',
    token: 'e229d68a-11af-0aa9-3633-13ba0563144f'
  }
];

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/account', function (req, res, next) {
  var model = {
    email: req.body.email,
    password: req.body.password
  };

  var existing = users.find(function (u) {
    return u.email === model.email;
  });

  if (!!existing) {
    return next(createError(403, 'Account already in use.'));
  }

  if (!validateRequired(model.email) || !validateEmail(model.email)) {
    return next(createError(403, 'The e-mail is not valid.'));
  }

  if (!validateRequired(model.password) || !validatePassword(model.password)) {
    return next(createError(403, 'The password must have minimum 4 characters.'));
  }

  users.push(model);
  res.status(201).send({ email: model.email });
})

app.post('/login', function (req, res, next) {
  var model = {
    email: req.body.email,
    password: req.body.password
  };

  if (!validateRequired(model.email) || !validateEmail(model.email)) {
    return next(createError(403, 'The e-mail is not valid.'));
  }

  if (!validateRequired(model.password) || !validatePassword(model.password)) {
    return next(createError(403, 'The password is not valid.'));
  }

  var existing = users.find(function (u) {
    return u.email === model.email && u.password === model.password;
  })

  if (!existing) {
    return next(createError(401, 'Invalid e-mail or password'));
  }

  existing.token = guid();

  res.status(200).send({
    token: existing.token
  });
})

app.get('/pokemon/:id', requiredLoggedMiddleware, function (req, res, next) {
  var id = req.params.id;

  if (!validateRequired(id)) {
    return next(createError(403, 'The id is required.'));
  }

  var pokemon = pokedex.find(function (p) {
    return p.id === id;
  });

  if (!pokemon) {
    return next(createError(404));
  }

  res.status(200).send(pokemon);
})

app.get('/pokemon/:id/image', requiredLoggedMiddleware, function (req, res, next) {
  var id = req.params.id;

  if (!validateRequired(id)) {
    return next(createError(403, 'The id is required.'));
  }

  var pokemon = pokedex.find(function (p) {
    return p.id === id;
  });

  if (!pokemon) {
    return next(createError(404));
  }

  var imagePath = './pokemon-images/' + id + pokemon.ename + '.png';
  var resolvedPath = path.resolve(imagePath);
  res.status(200).sendFile(resolvedPath);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err);
});

module.exports = app;
