import "@babel/polyfill";

import { readFileSync } from "fs";
import React from "react";
import { renderToString } from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { HeadCollector } from "react-head";
import { resetContext } from "react-beautiful-dnd";
import App from "../app/components/App";
import rootReducer from "../app/reducers";
import { SHOULD_RUN_PIWIK, PIWIK_COOKIE_DOMAIN, PIWIK_URL, PIWIK_SITE_ID } from "../constants";

// Get the manifest which contains the names of the generated files. The files contain hashes
// that change every time they are updated, which enables aggressive caching.
const manifest = JSON.parse(
  readFileSync(`./dist/public/manifest.json`, "utf8")
);

const css = readFileSync("./dist/public/main.css", "utf8");

const renderPage = (req, res) => {
  // Put initialState (which contains board state) into a redux store that will be passed to the client
  // through the window object in the generated html string
  const store = createStore(rootReducer, req.initialState);

  const context = {};
  const headTags = [];
  resetContext();

  // This is where the magic happens
  const appString = renderToString(
    <HeadCollector headTags={headTags}>
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </HeadCollector>
  );

  const preloadedState = store.getState();

  const { id: userId } = req.user;

  const piwikCodeToRun = `
    var _paq = _paq || [];
    _paq.push(["setCookieDomain", "${PIWIK_COOKIE_DOMAIN}"]);
    _paq.push(['setUserId', '${userId}']);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="${PIWIK_URL}";
      _paq.push(['setTrackerUrl', u+'piwik.php']); 
      _paq.push(['setSiteId', '${PIWIK_SITE_ID}']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
  `;

  // !!MUST BE USED FOR OLDER CHROME VERSIONS - UNDER 54!!
  const webAPIAppendNodePolyfill = `
    (function (arr) {
      arr.forEach(function (item) {
        if (item.hasOwnProperty('append')) {
          return;
        }
        Object.defineProperty(item, 'append', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function append() {
            var argArr = Array.prototype.slice.call(arguments),
              docFrag = document.createDocumentFragment();
            
            argArr.forEach(function (argItem) {
              var isNode = argItem instanceof Node;
              docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
            });
            
            this.appendChild(docFrag);
          }
        });
      });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
  `;

  const html = `
    <!DOCTYPE html>
    <html style="width: 100vw;">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="description" content="An open source kanban application created with React and Redux. ">
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/static/favicons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/favicons/apple-touch-icon-152x152.png" />
        <link rel="icon" type="image/png" href="/static/favicons/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/static/favicons/favicon-16x16.png" sizes="16x16" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/static/favicons/mstile-144x144.png" />
        <meta property="og:image" content="https://reactkanban.com/static/favicons/og-kanban-logo.png">
        <style>${css}</style>
        ${renderToString(headTags)}
      </head>
      <body dir="rtl" 
      style="overflow-x: hidden">
        <div id="app">${appString}</div>
      </body>
      <script>
        ${SHOULD_RUN_PIWIK ? piwikCodeToRun : ''}
        ${webAPIAppendNodePolyfill}
        window.PRELOADED_STATE = ${JSON.stringify(preloadedState)}
      </script>
      <script src=${manifest["main.js"]}></script>
    </html>
  `;
  res.send(html);
};

export default renderPage;