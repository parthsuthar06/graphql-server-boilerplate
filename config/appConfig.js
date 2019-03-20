/* jshint node: true */
/* jshint esnext: true */
'use strict';

/**
 * Highly recommend to use dotenv module
 * for process.env variable.
 */
const config = {
    "server": {
        "port": process.env.PORT || 3000
    },
    "default_error_http_code": 200,
    "default_error_code": 1,
    "default_success_code": 0,
    "default_error_message": "Invalid token",
    "default_error_request_message": "Error encountered processing the request",
    "default_error_redirect_message": "Error invalid API endpoint,For Graphql client goto",
    "default_success_message": "Successfully processed the request",
};

module.exports = config;