const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

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

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
