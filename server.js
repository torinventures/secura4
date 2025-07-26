/*
 * This file is used to create, initialize and start a HapiJS server
 *
 * Author: Aayush Gour
 */

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { default: mongoose } = require('mongoose');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiAPIVersion = require('hapi-api-version');
// eslint-disable-next-line no-unused-vars
const config = require('./config');
const Pack = require('./package.json');
const { authName } = require('./src/utility/constants');
const routes = require('./src/modules/router/routes.controller');
const { validateToken } = require('./src/modules/auth/token.service');
const { logRequestSerializer, logger } = require('./src/utility/logger');
const { apiPrefix } = require('./src/modules/router/routes.versions');

const { HASHING_KEY, MONGO_URI } = process.env;

const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
        cors: {
            origin: ['*'],
        },
    },
});

exports.connectToDatabase = async (connectionUri) => {
    try {
        logger.info('Connecting to DB');
        await mongoose.connect(connectionUri).then(() => {
            logger.info('Connection Established');
        }).catch((error) => {
            logger.error(error);
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

const setupAuth = async () => {
    // setting up authentication
    await server.register(Jwt);
    server.auth.strategy(authName, 'jwt', {
        keys: HASHING_KEY,
        verify: false,
        validate: validateToken,
    });
    server.auth.default('custom-jwt');
};

const setupRoutes = async () => {
    // defining routes
    // Prefix for all API endpoints (Global base path)
    server.realm.modifiers.route.prefix = apiPrefix;
    server.route(routes);
};

const setupAPIVersion = async () => {
    await server.register([{
        plugin: HapiAPIVersion,
        options: {
            validVersions: [1],
            defaultVersion: 1,
            vendorName: 'localhost',
        },
    }]);
};

const setupSwagger = async () => {
    const swaggerOptions = {
        info: {
            title: 'API Documentation',
            version: Pack.version,
        },
        grouping: 'tags',
    };
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ]);
};

const setupLogging = async () => {
    // Logging all incoming requests
    server.ext({
        type: 'onRequest',
        method: (request, h) => {
            logger.info(logRequestSerializer(request));
            return h.continue;
        },
    });
    // Logging all outgoing responses
    server.events.on('response', (response) => {
        const responseLog = {
            type: 'RESPONSE',
            method: response?.method?.toUpperCase(),
            path: response.path,
            statusCode: response.response.statusCode,
            message: response?.result?.message,
            error: response.response?.error,
        };
        logger.info(responseLog);
    });
};

exports.init = async () => {
    await setupLogging();
    await setupAuth();
    await setupRoutes();
    await setupAPIVersion();
    logger.info(`Initializing ${process.env.NODE_ENV} Server`);
    await server.initialize();
    return server;
};

exports.start = async () => {
    await this.connectToDatabase(MONGO_URI);
    await setupSwagger();
    await this.init();
    await server.start();
    logger.info(`Server started on ${server.info.uri}`);
    return server;
};
