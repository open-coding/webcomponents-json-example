# webcomponents-json-example

⚠ Experimental ⚠ example that demonstrates how an autonomous custom element can be updated by JSON. I just wanted to write my first custom element and investigate how JSON can be used to initialize and update a webcomponent.

The example is deliberately kept very minimalistic and consists of only three files that are copied via [gulp](https://gulpjs.com/) to the `\dist` folder. There is only a simple build stack just to ensure that this example runs in common browser. Yes, including IE11 😥 

Not all browsers support all necessary specifications, so I recommend to use Google Chrome. For more information [see caniuse.com](https://caniuse.com/#search=webcomponents)

The example creates an [autonomous custom element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-autonomous-example) and uses a [ShadowDOM](https://dom.spec.whatwg.org/#shadow-trees). It does not use templates yet, but I'll change that in near future.

# How to start

You should have installed [npm](https://www.npmjs.com/) and [gulp](https://gulpjs.com/docs/en/getting-started/quick-start)

1. `git clone https://github.com/open-coding/webcomponents-json-example.git`
2. `npm install`
3. `npm start`

After the last command it should look like this:
```
PS repositories:\webcomponents-json-example> npm start

> webcomponents-json-example@2.0.0 start D:\Repositories\webcomponents-json-example
> gulp

[23:50:13] Using gulpfile D:\Repositories\webcomponents-json-example\gulpfile.js
[23:50:13] Starting 'default'...
[23:50:13] Starting 'copy'...
[23:50:13] Starting 'html'...
[23:50:13] Starting 'css'...
[23:50:13] Starting 'babel'...
[23:50:14] Finished 'css' after 613 ms
[23:50:14] Finished 'babel' after 614 ms
[23:50:14] Finished 'html' after 616 ms
[23:50:14] Finished 'copy' after 617 ms
[23:50:14] Starting 'run-server-and-watch'...
[23:50:14] Starting 'run-server'...
[23:50:14] Starting 'watch'...
[23:50:14] Starting 'connect'...
[23:50:14] Starting 'open'...
[23:50:14] Starting server...
[23:50:14] Server started http://localhost:8001
[23:50:14] LiveReload started on port 35729
[23:50:14] Running server
[23:50:14] Opening http://localhost:8001/ using the default OS app
```

## Gulp task explained

The gulp task copies all `.css` and `.html` files into a folder called `dist`. It also copies all `.js` files, but before doing so they will be transpiled with [babel](https://babeljs.io/). Then a server is started an the default browser is opened to view the example. All `.css`, `.html` and `.js` files in the `src` folder are watched and if they change they will be copied and transpiled (if it's a JavaScript file) again and the browser gets automatically reloaded. 

# Used dependencies

Within the package.json there are only dev-dependencies for [gulp](https://gulpjs.com/) and [babel](https://babeljs.io/) and some of its plugins to get the build-chain running. I did add [babel](https://babel.js.io) to get some features work that aren't supported in IE11:

* [template-literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
* [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Defining_classes)
* [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

# Used polyfills

I added the [webcomponents/polyfills](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) from a CDN directly into the `index.html` to get the webcomponents work in older browsers like IE11, that have no native support for that. Another polyfill that I added is for having the ability to add multiple classes to `classList`. It's also referenced directly from a CDN.