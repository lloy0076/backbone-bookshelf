## Bookshelf Using Backbone Demo

This is a demo using [Backbone JS](https://www.backonejs.org/) to communicate with a
RESTFUL book API.

The following fields represent a book:

- a unique ID;
- a required title;
- a required author;
- an optional format.

This application does not take into account any "types" of the above fields, but
it is standard for the ID to be a numerically increasing integer; the rest should
be strings allowed to be at least 255 characters.

The application uses a crude for of "long polling" when on the "#list" page to help
the list stay up to date. Specifically, a timer using `setInterval` is set for
25-35 seconds (at random) after which a further request will be made to the
server.

## RESTFUL Server

Any server that conforms to a RESTFUL server as specified by Backbone JS may be used.

This happens to work well with:

* https://github.com/lloy0076/laravel-bookshelf

## TODO

- Remove the hardcoded server URL;
- Write tests;
- Handle backend errors more gracefully
  - Currently, some backend errors are simply serialised to the user (so they say
  technically valid but user unfriendly things)
- Figure out how to use a non-hash router
  - I tried to get a `pushState` router working, but it refused to play correctly
- Close the stack collapse on route change in mobile/small screen mode.

## LICENSE

Copyright 2020 David S. Lloyd <jwickentower [at] gmail.com>.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the 
License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an 
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the 
specific language governing permissions and limitations under the License.
