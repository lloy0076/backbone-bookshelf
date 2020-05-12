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
const Swal = require('sweetalert2');

/**
 * @class AddComponent
 */
class EditComponent {
    /**
     * Construct an Add Component.
     *
     * @param backbone
     * @param model
     * @return {*}
     */
    constructor(backbone = null, model = null) {
        if (!backbone) {
            throw new Error('Attempt to create component without backbone.');
        }

        if (!model) {
            throw new Error('Attempt to create component without a model');
        }

        this.view = backbone.View.extend(
            {
                tagName: 'div',
                render() {
                    const template = require('./templates/edit_item.njk');
                    const html = template.render({ item: model });
                    this.$el.html(html);

                    return this;
                },
                events: {
                    submit: (event) => {
                        event.preventDefault();

                        const data = {
                            title: $('#title'),
                            author: $('#author'),
                            format: $('#format'),
                        };

                        Object.keys(data).forEach((value) => model.set(value, data[value].val()));

                        const saved = model.save(null, {
                            success: () => {
                                Swal.fire({
                                    title: 'Book Updated',
                                    text: 'The book was updated.',
                                    icon: 'success',
                                    timer: 1500,
                                });

                                Object.values(data).forEach((value) => value.val(null));
                                window.location = '/#list';
                            },
                            error: (model, error) => {
                                const responseText = JSON.parse(error.responseText);
                                Swal.fire({
                                    title: 'Error',
                                    text: responseText ? responseText.message : 'Something Went Wrong.',
                                    icon: 'error',
                                    timer: 3000,
                                });
                            }
                       });

                        backbone.logger.debug('Return:',
                            { saved, type: typeof saved, name: saved.constructor.name });
                    }
                }
            }
        );
    }

    /**
     * Get a new view/component.
     *
     * @return {*}
     */
    make() {
        return new this.view();
    }
}

module.exports = EditComponent;
