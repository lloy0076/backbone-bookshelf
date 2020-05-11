require('backbone-es6-promise');

const _ = require('lodash');

const $ = jquery = require('jquery');
const backbone = require('backbone');
backbone.emulateHTTP = true;
backbone.$ = $;

const moment = require('moment');
const winston = require('winston');

const TestComponent = require('./TestComponent');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        // winston.format.timestamp(),
        winston.format.splat(),
        winston.format.simple(),
        // winston.format.prettyPrint(),
    ),
    transports: [new winston.transports.Console()],
});

backbone.logger = logger;

$(() => {
    const component = new TestComponent(backbone).make();
    const container = $('#container');

    if (container.length < 1) {
        throw new Error('Cannot find relevant container?');
    }

    container.append(component.render().el);
});

const Book = backbone.Model.extend({
    defaults: {
        id: null,
        title: 'New Book',
        author: 'Anonymous',
        format: 'Paperback',
        created_at: null,
        updated_at: null,
        deleted_at: null,
    },
    idAttribute: 'id',
});

_.extend(Book, backbone.Events);

logger.debug(`Starting at ${moment().format()}.`);

const Books = backbone.Collection.extend({
    model: Book,
    url: 'http://laravel-bookshelf.test/api/v1/book',
    initialize() {
        this.on('all', this.logEvent, this);
    },
    logEvent(event, cb, ctx) {
        logger.silly('Ctx %s', ctx);
    },
});

_.extend(Books, backbone.Events);

const them = new Books();

them.fetch({ merge: false }).then((results) => {
    them.forEach((value) => {
        logger.silly('%d %s', value.id, value.get('title'));
    })
});

