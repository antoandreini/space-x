const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const config = require('config');
const cors = require('cors');
const signale = require('./utils/signale');
const pjson = require('./package.json');

const serverConfig = config.get('server');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: '*'
  }));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = parseInt(serverConfig.port, 10) || 8080;

routes(app, pjson.version);

app.listen(port, () => {
  signale.info(`Version: ${pjson.version}`);
  signale.success(`App running on port: ${serverConfig.port}`);
});
