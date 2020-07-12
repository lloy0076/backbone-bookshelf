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
import('bootstrap');
import('bootstrap/dist/css/bootstrap.min.css');

require('gasparesganga-jquery-loading-overlay');

const _ = require('lodash');
const Swal = require('sweetalert2');

const backbone = require('backbone');
backbone.emulateHTTP = true;
backbone.$ = $;
backbone._ = _;

$.LoadingOverlay('show');

const App = require('./App');

$(() => {
    const app = new App(backbone);
    // new app.Routes();
    app.backbone.history.start({
        pushState: true,
        route: '/',
    });

    $.LoadingOverlay('hide');

    /**
     * All navigation that is relative should be passed through the navigate
     * method, to be processed by the router. If the link has a `data-bypass`
     * attribute, bypass the delegation completely.
     */
    $(document).on("click", "a[href]:not([data-bypass])", function (evt) {
        // Get the absolute anchor href.
        const href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        // Get the absolute root.
        const root = location.protocol + "//" + location.host + '/';

        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop.slice(0, root.length) === root) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();

            // `Backbone.history.navigate` is sufficient for all Routers and will
            // trigger the correct events. The Router's internal `navigate` method
            // calls this anyways.  The fragment is sliced from the root.
            app.backbone.history.navigate(href.attr, true);
        }
    });
});
