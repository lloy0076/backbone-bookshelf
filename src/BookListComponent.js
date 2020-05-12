/**
 *  Copyright 2020 David S. Lloyd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
const _ = require('lodash');
const Swal = require('sweetalert2');

const moment = require('moment');

const EditComponent = require('./EditComponent');

/**
 * @class BookListComponent
 */
class BookListComponent {
    /**
     * Construct a Book List Component.
     *
     * @param backbone
     * @param collection
     * @return {*}
     */
    constructor(backbone = null, collection = []) {
        if (!backbone) {
            throw new Error('Attempt to create component without backbone.');
        }

        this.view = backbone.View.extend(
            {
                collection,
                tagName: 'div',
                render(order = 'asc') {
                    let html = '';
                    if (this.collection.length) {
                        const template = require('./templates/list_item.njk');

                        html = template.render({ items: this.collection });
                    } else {
                        html = '<ul><li>No Items</li></ul>';
                    }

                    this.$el.html(html);

                    return this;
                },
                initialize() {
                    _.bindAll(this, 'render');

                    const listeners = ['add', 'remove', 'update', 'reset', 'sort', 'destroy', 'sync'];
                    listeners.forEach((v) =>
                        this.listenTo(this.collection, v, () => {
                            backbone.logger.silly(`Re-rendering because of ${v}.`);
                            this.render();
                        }));
                },
                events: {
                    'click button.delete': (event) => {
                        event.preventDefault();

                        const item = collection.get(event.target.id);

                        item.destroy(
                            {
                                success: () => {
                                    Swal.fire({
                                        title: 'Book Deleted',
                                        text: 'The book was deleted.',
                                        icon: 'success',
                                        timer: 1500,

                                    });
                                },
                                error: (model, error, ...errors) => {
                                    // A 404 is effectively an 'ok'...
                                    if (error.status === 404) {
                                        Swal.fire({
                                            title: 'Book Deleted',
                                            text: 'The book was not present on the server.',
                                            icon: 'success',
                                            timer: 1500,
                                        });
                                    } else {
                                        const responseText = JSON.parse(error.responseText);
                                        Swal.fire({
                                            title: 'Error',
                                            text: responseText ? responseText.message : 'Something Went Wrong.',
                                            icon: 'error',
                                            timer: 3000,
                                        });
                                    }
                                },
                            });
                    },
                },

            },
        );
    }

    /**
     * Get a new view/component.
     *
     * @return {*}
     */
    make() {
        const view = new this.view();
        return view;
    }
}

module.exports = BookListComponent;
