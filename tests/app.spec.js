const lodash = require('lodash');

const backbone = require('backbone');
backbone.emulateHTTP = true;
backbone.$ = $;
backbone._ = _;

const App = require('../src/App');

const knownBooks = {
    1: {
        'id': 1,
        'title': 'The Hunger',
        'author': 'Whitley Strieber',
        'format': 'paperback',
    },
    2: {
        'id': 2,
        'title': 'Kanban - Just-In-Time At Toyota',
        'author': 'Japan Management Association',
        'format': 'hardcover',
    },
    3: {
        'id': 3,
        'title': 'A Pocket Style Manual',
        'author': 'Diana Hacker and Nancy Sommers',
        'format': null,
    },
    4: {
        'id': 4,
        'title': 'A New Hope',
        'author': 'George Lucas',
        'format': 'paperback',
    },
    5: {
        'id': 5,
        'title': 'Our Father',
        'author': 'Pope Francis',
        'format': 'hardcover',
    },
};

describe('testing app', async function () {
    it('tests app', function (done) {
        const app = new App(backbone);
        expect(app).to.be.ok;

        expect(app).to.be.an('object');
        expect(app).to.include.keys('backbone', 'Book', 'them', 'Routes');
        expect(app.them.size()).to.equal(0);
        done();
    })
});

describe('testing book update', async function () {
    it('test book 0 the hunger', function (done) {
        const app = new App(backbone);
        expect(app).to.be.ok;

        app.them.fetch({
            success(results) {
                results.forEach((value, index) => console.log(value.attributes));
                done();
            }
        });
    });
});

describe('testing book - index and show', async function () {
    it('test book', function (done) {
        const app = new App(backbone);
        expect(app).to.be.ok;

        expect(app.Book).to.be.ok;
        expect(app.Book).to.be.a('function');
        done();
    });

    it('test book collection', function (done) {
        const app = new App(backbone);
        expect(app).to.be.ok;

        app.them.fetch({
            success(results) {
                expect(app.them.size()).to.equal(5);
                app.them.forEach((model) => {
                    expect(model).to.be.an('object');
                    expect(model).to.include.keys('cid', 'attributes', 'changed');
                    expect(model.changed).to.be.empty;
                    expect(model.attributes).to.include.keys('id',
                        'title',
                        'author',
                        'format',
                        'created_at',
                        'deleted_at',
                        'updated_at');

                    const theBook = knownBooks[model.get('id')];

                    const toContain = {
                        title: model.get('title'),
                        author: model.get('author'),
                        format: model.get('format'),
                    };

                    expect(theBook).to.contain(toContain);
                });

                done();
            },
        });
    })

    it('test routes', function (done) {
        const app = new App(backbone);
        expect(app).to.be.ok;

        const routes = app.routeObj;
        expect(routes).to.be.ok;

        expect(routes).to.be.an('object');
        expect(routes).to.include.keys(['routes']);

        const actualRoutes = routes.routes;
        expect(actualRoutes).to.contain({
            add: 'add',
            list: 'defaultRoute',
            'edit/:id': 'editRoute',
            '': 'defaultRoute',
        });

        done();
    });
});

// @todo Test update
// @todo Test delete
