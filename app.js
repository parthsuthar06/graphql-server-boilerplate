/**
 * application related imports
 */
const express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    compression = require('compression'),
    winston = require('winston'),
    os = require('os'),
    addRequestId = require('express-request-id')();
/**
 * graphql related imports
 */
const server = require('./graphql/server')

const app = express();

global.config = require('./config/appConfig');
console.log("SERVER CONFIG : ", JSON.stringify(global.config, null, 2));

/**
 * Specify a single subnet for trusted proxy.
 **/
app.set('trust proxy', 'loopback');

/**
 * Protects the application from some well known web vulnerabilities by setting HTTP headers appropriately.
 **/
app.use(helmet());

/**
 * Decrease the size of the response body to increase the speed of a web application.
 **/
app.use(compression());

/**
 * CORS middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const allowCrossDomain = function (req, res, next) {
    const allowOrigin = req.headers.origin || "*";
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authentication, x-access-token");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
};
app.use(allowCrossDomain);
/**
 * error handler
 */
app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Something broke!')
})
/**
 * Create Log folder if not exists change 
 * logfolder path desired to your needs. 
 */
const logFolder = `./logs/${os.hostname()}`;
if (!fs.existsSync(logFolder)) {
    try {
        fs.mkdirSync(logFolder);
    } catch (e) {
        throw new Error(`Error creating log folder ${logFolder} ,Please create manually- ${JSON.stringify(e)}`);
    }
}

/**
 * Create access log stream.
 **/
const accessLogStream = fs.createWriteStream(`${logFolder}/access.log`, { flags: 'a' });

/**
 * Initialize access log writer.
 **/
global.logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            timestamp: function () {
                return moment.utc().format("YYYY-MM-DDTHH:mm:ss");
            },
            formatter: function (options) {
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            },
            colorize: true,
            name: 'access-file',
            stream: accessLogStream,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        })
    ],
    exitOnError: false
});

/**
 * Create server log stream.
 **/
const serverLogStream = fs.createWriteStream(`${logFolder}/server.log`, { flags: 'a' });

/**
 * Define server log date format.
 **/
morgan.token('date', function (req, res) {
    return moment.utc().format("YYYY-MM-DDTHH:mm:ss");
});

/**
 * Define server log request headers to be written.
 **/
morgan.token('type', function (req, res) {
    return JSON.stringify(req.headers);
});

/**
 * Define server log UUID to be written.
 **/
morgan.token('uuid', function (req, res) {
    return "UUID=" + res._headers['x-request-id'];
});

/**
 * Initialize response UUID.
 **/
app.use(addRequestId);

/**
 * Initialize server log writer.
 **/
app.use(morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" \':type\' :uuid - :response-time ms', {
    stream: serverLogStream
}));

/**
 * Configure body parser
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


/**
 * single graphql endpoint
 */
server.applyMiddleware({ app });

/**
 * Default handler for invalid API endpoint
 * remove it if this is not required.
 **/
app.all('*', function (req, res) {
    res.status(global.config.default_error_http_code).json({
        "responseCode": global.config.default_error_code,
        "responseDesc": `${global.config.default_error_redirect_message} Link: http://localhost:${config.server.port}/graphiql`
    });
});
/**
 * Server setup
 */
const port = config.server.port;
app.listen({ port }, function () {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
});