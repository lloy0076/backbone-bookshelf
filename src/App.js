const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');

const Swal = require('sweetalert2');

const BookListComponent = require('./BookListComponent');
const AddComponent = require('./AddComponent');
const EditComponent = require('./EditComponent');

/**
 * @class Main
 */
class App {
    /**
     * Construct an Main class.
     */
    constructor(backbone = null) {
        if (!backbone) {
            throw new Error('Cannot start app without a configured backbone instance.');
        }

        this.backbone = backbone;

        this.backbone.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.splat(),
                winston.format.simple(),
                // winston.format.prettyPrint(),
            ),
            transports: [new winston.transports.Console()],
        });

        this.setupBookCollection();
        this.setupRoutes();

        this.routeObj = new this.Routes();
    }

    /**
     * Setup the routes.
     */
    setupRoutes() {
        const that = this;

        this.Routes = this.backbone.Router.extend({
            routes: {
                'add': 'add',
                'list': 'defaultRoute',
                'edit/:id': 'editRoute',
                '': 'defaultRoute',
            },
            initialize() {
                that.them.fetch();
            },
            defaultRoute: function () {
                // Scatter the calls over 10 seconds.
                const interval = Math.ceil(Math.random() * 10000) + (25 * 1000);
                that.i = setInterval(() => that.them.fetch(), interval);

                that.backbone.logger.debug('Default route, interval %d', Number.parseFloat(interval / 1000).toFixed(2));

                const component = new BookListComponent(that.backbone, that.them).make();

                that.renderIntoContainer(component);
            },
            add() {
                const component = new AddComponent(that.backbone, that.them).make();

                if (that.i) {
                    clearInterval(that.i);
                }

                that.renderIntoContainer(component);
            },
            editRoute(id) {
                if (that.i) {
                    clearInterval(that.i);
                }

                that.them.fetch({
                    success(results) {
                        const model = results.get(id);

                        if (!model) {
                            Swal.fire({
                                title: 'Error',
                                text: `Unable to find model ${id}.`,
                                icon: 'error',
                                timer: 3000,
                            });
                            window.location('/#');
                        }

                        that.backbone.logger.debug('Found moodel:', { model });

                        const component = new EditComponent(that.backbone, model).make();
                        that.renderIntoContainer(component);
                    },
                    error(error) {
                        that.backbone.logger.error('Error!', { error });
                    },
                });
            },
        });
    }

    /**
     * Renders the given component into the DOM.
     *
     * @param component
     * @param empty
     * @param id
     */
    renderIntoContainer(component = null, empty = true, id = '#container') {
        if (!component) {
            throw new Error(`Attempt to render an invalid component into the container ${id}.`);
        }

        const container = $(id);

        if (container.length < 1) {
            throw new Error(`Cannot find container ${id}.`);
        }

        if (empty) {
            container.empty();
        }

        container.append(component.render().el);
    }

    /**
     * Setup the book collection.
     *
     * @todo This should be in its own class or service.
     */
    setupBookCollection() {
        this.Book = this.backbone.Model.extend({});

        _.extend(this.Book, this.backbone.Events);

        this.backbone.logger.debug(`Starting at ${moment().format()}.`);

        this.Books = this.backbone.Collection.extend({
            model: this.Book,
            url: SERVICE_URL,
            comparator: 'title',
        });

        this.them = new this.Books();
    }
}

module.exports = App;
