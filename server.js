const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function doubler(req, res, next){
  
  const number = Number(req.query.number || 0)

  req.doubled = number * 2

  next()
}

function dateLogger(req, res, next) {
  console.log(new Date().toISOString())

  next()
}

function URLmethod(req, res, next) {
  console.log(req.method)
  console.log(req.originalUrl)

  next()
}

function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  const password = req.headers.password

  if (!password) {
    res.status(400).json({message: 'NEED A PASSWORD'})
  } else {
    password.toLowerCase() === 'mellon' 
      ? next() 
      : res.status(401).json({message: 'You shall not pass'})
  }

  
}

server.use(helmet()) // third party middleware
server.use(express.json());
server.use(gateKeeper)
server.use(morgan('dev'))


server.use(dateLogger)
server.use(URLmethod)



server.use('/api/hubs', hubsRouter);

server.get('/', doubler, (req, res) => {
  res.status(200).json({numnber: req.doubled})
});

module.exports = server;
