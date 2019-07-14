# webcomponents-json-example

⚠ Experimental ⚠ example that demonstrates how an autonomous custom element can be updated by JSON. I just wanted to write my first custom element and investigate how JSON can be used to initialize and update a webcomponent instead of writing dozens of attributes where some of them may not even result in a standard html attribute. This is especially intended for applications that receive data from a server and have no frontend logic in the browser.

The example is deliberately kept very minimalistic and consists of only a few files that are packed via [gulp](https://gulpjs.com/) to the `\dist` folder. There is only a simple build stack just to ensure that this example runs in common browser. Yes, including IE11 😥 

Not all browsers support all necessary specifications, so I recommend to use Google Chrome. For more information [see caniuse.com](https://caniuse.com/#search=webcomponents)

The example creates two [autonomous custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-autonomous-example) and uses a [ShadowDOM](https://dom.spec.whatwg.org/#shadow-trees). It does not use templates yet, but I'll change that in near future.

# How to start

You should have installed [npm](https://www.npmjs.com/) and [gulp](https://gulpjs.com/docs/en/getting-started/quick-start)

1. `git clone https://github.com/open-coding/webcomponents-json-example.git`
2. `npm install`
3. `npm start`

After the last command it should look like this:
```
PS repositories:\webcomponents-json-example> npm start

> webcomponents-json-example@2.0.0 start repositories:\webcomponents-json-example
> gulp

[00:24:56] Using gulpfile repositories:\webcomponents-json-example\gulpfile.js
[00:24:56] Starting 'default'...
[00:24:56] Starting 'copy'...
[00:24:56] Starting 'html'...
[00:24:56] Starting 'css'...
[00:24:56] Starting 'babel'...
[00:24:56] Finished 'html' after 580 ms
[00:24:56] Finished 'css' after 581 ms 
[00:24:56] Version: webpack 4.35.3
Built at: 2019-07-15 12:24:56 AM
    Asset      Size  Chunks             Chunk Names
bundle.js  8.95 KiB       0  [emitted]  main       
Entrypoint main = bundle.js
[00:24:57] Finished 'babel' after 1.4 s
[00:24:57] Finished 'copy' after 1.4 s
[00:24:57] Starting 'run-server-and-watch'...
[00:24:57] Starting 'run-server'...
[00:24:57] Starting 'watch'...
[00:24:57] Starting 'connect'...
[00:24:57] Starting 'open'...
[00:24:57] Starting server...
[00:24:57] Server started http://localhost:8001
[00:24:57] LiveReload started on port 35729
[00:24:57] Running server
[00:24:57] Opening http://localhost:8001/ using the app iexplore
```

## Gulp task explained

The gulp task copies all `.css` and `.html` files into a folder called `dist`. It also bundles all `.js` files with [webpack](https://webpack.js.org/) and after that the JavaScript will be transpiled with [babel](https://babeljs.io/). Then a server is started and the internet explorer is opened to view the example. You may change that configuration within `gulpfile.js`. All `.css`, `.html` and `.js` files in the `src` folder are watched and if they change they will be copied and transpiled (if it's a JavaScript file) again and the browser gets automatically reloaded. 

# Used dependencies

Within the package.json there are only dev-dependencies for [gulp](https://gulpjs.com/), [webpack-stream](https://github.com/shama/webpack-stream), [babel](https://babeljs.io/) and some of its plugins to get the build-chain running. I did add [babel](https://babel.js.io) to get some features work that aren't supported in IE11:

* [template-literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
* [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Defining_classes)
* [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
* [imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

# Used polyfills

I added the [webcomponents/polyfills](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) from a CDN directly into the `index.html` to get the webcomponents work in older browsers like IE11, that have no native support for that. Another polyfill that I added is for having the ability to add multiple classes to `classList`. It's also referenced directly from a CDN.
