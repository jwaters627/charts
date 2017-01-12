# Crimson Hexagon UI

We're using es6 with some functionality from es7, like decorators. To do that, our build system runs with npm, babel, react, hot-reload, webpack, scss and "transpiles" everything into es5 for browser compatibility. If you'd like more information about webpack visit: https://github.com/petehunt/webpack-howto and https://www.youtube.com/watch?v=VkTCL6Nqm6Y&feature=youtu.be.

## INSTALL
```
npm install
```

All packages are shared between apps and belong in this root directory: src/ui/ -> src/ui/node_modules.
If you need to install a new package for your app, do it here and don't forget to save it to package.json (--save).


## Add a new app to the build process
- make a new folder for your app in /apps (e.g. /apps/myApp)
- copy /apps/appx/webpack.config.js into /apps/myApp/webpack.config.js
- modify /myApp/webpack.config.js to use your app main entry point  
(/myApp/webpack.config.js will be merged into the main webpack.config.js)  
your app config will look something like:
```js
module.exports = {
    entry: {
        myApp: path('./main.js')
    }
};
```
- add your app config to /config/apps.js which will end up looking like this:
```js
module.exports = [
    require('../apps/appx/webpack.config'),
    /*...more apps...*/
    require('../apps/myApp/webpack.config')
];
```

now go to /src/ui with the command line and run:
```
npm run build
```

watch for changes with:
```
npm run watch
```

pass a different webpack config with your app specific settings as arguments to the scripts:
```
npm run watch other.webpack.config.js
```

run webpack-dev-server using:
```
npm run dev <path to your webpack.config>
```
Check the easy-insights project for an example of a dev config (webpack.config.dev.js), which runs with react-hot-loader and proxies api calls to a dev instance (no maven!). Unless you change the config, you'll need an index.html for the development phase.

### Create your index.ftl file
Your app needs a index.ftl served by the java backend at some url. The easy insights project has one at /chweb/war/WEB-INF/views/easy-insights/index.ftl.

Your index.ftl needs to include your app's bundle and the commons bundle, which is generated automatically by webpack and contains common libraries to all apps. Include script tags the end of body like this:
```
  <script src="${urlProvider.versionedURL('/chs/dist/bundles/common.js')}"></script>
  <script src="${urlProvider.versionedURL('/chs/dist/bundles/easyinsights.js')}"></script>
```

## ASSETS

All assets (css, scss, images and font files), are loaded by webpack through require:

```js
  require('./somefile.scss') // in your component to load scss or css. That's it.

  const imgUrl = require('./image.png'); // load image url in js
  ...
  render () {  
    return <div><img src={imgUrl} /></div>
  }
```

Don't forget the ./ for assets in the same directory, otherwise it looks for them in node_modules.

Image and font urls inside css/scss are transformed automatically. All files, except css, are copied to the destination folder. Some of them, like small images, are embedded within css or js. All css is embedded into your js bundle and loaded on runtime. That is why YOU CAN'T rely on execution order of css (no overwrites without corresponding hierarchy or !important).

There's also a json-loader for webpack, but beware: it injects the json into the bundle. If your json file is too big to do that, like a big topojson file, then load it like this:

```js
  const fileUrl = '../../resources/WORLD-states-topo.json';
  const worldStatesUrl = require('!file?name=json/[hash].[ext]!' + fileUrl);

  // then load it with fetch/axios or else
  fetch(worldStatesUrl).then(result => {
    // do something
  });
```

## Flux Guide

### The Gist
<img src="https://facebook.github.io/react/img/blog/flux-diagram.png" width="800">

### React Views
Stateless React Components: receive state to render via props

### ControllerViews
Stateful React Components (a.k.a. higher-order components or container components)
This is the main entry point of a module. A module is actually a module if and only if it has a controller that orchestrates its pieces.
The react component manages the lifecycle of the module using the [React API](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)
A controller view must have at least one stateless React View and one Store connected.

## State Flow
- The controller listens to the connected stores Change Events in order to trigger setState and re-render the view
- It gets the state from the connected stores
- It passes the state down to its contained (stateless) component via props for rendering

## Disposable Resources
- The controller assumes that the connected stores might implement the Disposable interface, so it will try to call dispose() on its stores when the module is removed (unmounted).
- If you are using singleton Stores and your store is not disposable (i.e. it does not implement the dispose method) that's OK, the controller won't do anything about it.

## Registered disposables (optional)
- The controller might also have other registered objects which implement the Disposable interface. This is optional. The main goal is to be able to dynamically create objects within the module that will be attached to its lifecycle. When the module is destroyed, the allocated resources will be destroyed as well. If you use global or singleton objects (e.g. action creators) you don't need this.

## How to make a controller view

```js

import {ControllerView, Statics} from 'chFlux';

@ControllerView({
  //stores: array of store keys, store instances and/or state getters
  //no state getter means Store.getState() is converted to the child stateless component props property directly

  stores: [
    'foo',
    [ 'bar', state => { bar : state.bar } ],
    SingletonStore,
    createStoreInstance()
  ],

  /*optional*/
  disposables: [ createDataService(), createStateTracker() ]
  actions: [ createActions()  ]
})
@Statics({
  propTypes: {
    state: Types.object.isRequired
  }
})

export default class StatelessComponent extends React.Component {
  render() {
    return <div>
      {this.props.state.someData},
      {this.props.state.moreData}
    </div>;
  }
}
```

### Flux Instance

Each app creates a Flux instance in its main entry point and passes it down to its children via react context.

The Flux object lets you manage Stores and Actions. It contains factories, disposers and getters.

### Stores
Stores are made of:
- state property implementation
- emitChange() calls, when its state changes, always from action callbacks
- action callbacks (or reducer functions in Redux jargon)

```js
export default class MyStore {

  constructor() {
    //initialize state
    this.state = {
      foo: 'someFoo',
      bar: 'someBar'
    };
  }

  init({localActions}) {
    //let's explicitly declare observed actions and callbacks
    this.observe([
      [GlobalActions.foo, this.onFoo],
      [localActions.bar, this.onBar]
    ]);
  }

  //the following functions are reducers in Redux
  //also, always consider using immutableJS

  onFoo(action) {
    this.state = _.assign({}, this.state, { foo: action.payload });
    this.emitChange(); //built-in store function
  }

  onBar(action) {
    this.state = _.assign({}, this.state, { bar: action.payload });
    this.emitChange(); //built-in store function
  }
}
```

Then, you use a factory to create a store instance somewhere in the application

...from the main entry point
```js
import {Flux} from 'chFlux';
import MyStore from 'modules/myModule/MyStore';

let flux = new Flux();
let myStore = flux.createStore(MyStore, 'myStoreID');
```

...or from a ControllerView
```js
import MyStore from 'modules/myModule/MyStore';

let myStore = this.context.flux.createStore(MyStore, 'myStoreID');
```

...and somewhere else
```js
let myStore = this.context.flux.getStore('myStoreID');
```

### Actions
You can create actions using the Actions utility. It has an actions factory which will return an action creator or a map of action creators.
The returned action creator is a function-object. Calling the function will trigger a flux-standard-action (FSA) https://github.com/acdlite/flux-standard-action with this shape
{ type: 'string', payload: {} }

For example, this code will create a map of action creators from some configuration:

```js
let myActions = flux.createActions('myActionsID', [
  'fetchStart', 'fetchDone', 'fetchFailed'
])
```

Now you can trigger one of its actions:
```js
myActions.fetchStart({
  timestamp: Date.now()
});
```

And observe() the actions from a store:

```js
class MyStore {
  constructor({flux}) {
    let myActions = flux.getActions('myActionsID');
    this.observe([
      [myActions.fetchStart, this.onFetchStart]
    ]);
  }
  onFetchStart(action) {
    this.state = {
      isLoading: true,
      timestamp: action.payload.timestamp
    };
    this.emitChange();

  }
}
```

The observe() method saves the subscription internally, which will be disposed automatically when the Store gets destroyed by the Controller.

Using these function-objects you can also subscribe() to each specific action (and only the registered callback will receive the action, not all registered callbacks). The subscribe method returns a subscription object, which is a Disposable.

For example you could subscribe to an action from a store using code like this:

```js
let subscription = myActions.fetchStart.subscribe( onFetchStart );
//time passes...
subscription.dispose();
```

This is exactly the same as using ```Store.observe``` (but on the other direction).

You can also get actions:
```js
let myActions = flux.getActions('myActionsID');
```

In order to do something like:
```js
flux.getActions('myActionsID').fetchStart()
```

## Note on the dispatcher implementation
Now we have the freedom to decide whether we would like to use an event emitter or facebook's dispatcher internally. The user of the actions should not necessarily know which implementation it's using. We could even give the option to pick a dispatcher implementation doing IOC in the future, and letting users pass the choice as a config argument to the action factory.

### Data Services (optional)
A data service is an ActionObserver. It lives in a separated object. It deals with data and its connection to the server. It can be implemented with a http rest api, realtime data, or any other implementation.
It's related to WebApiUtils in the diagram, but it's not a singleton, it's dynamically allocated and it's locally attached to a module's lifecycle.
- It dispatches actions related to data.
- It might observe other actions in order to know how/when to get data updates.
- It is disposable (will be disposed by the controller)
- Its actions are usually observed by Stores

```js
import {ActionObserver} from 'chFlux';

class MyDataService {
  constructor({localActions}) {
    ActionObserver(this);
    this.localActions = localActions;
    this.observe([
      [GlobalActions.foo, this.onFoo]
    ]);
  }
  onFoo() {
    this.localActions.barFetch();
    fetch('/bar').then((data) => {
      this.localActions.barUpdated(data)
    })
    .catch((err) => {
      this.localActions.barFailed(err)
    });
  }
  dispose() {
    this.localActions = null;
  }
}
```

## Data Services as Stateless Functions

You can also make a data service with a stateless function instead of a stateful class

```js
function onFoo(localActions) {
  localActions.barFetch();
  fetch('/bar')
    .then((data) => {
      localActions.barUpdated(data)
    })
    .catch((err) => {
        localActions.barFailed(err)
      });
  }
```

### Routes
TODO

### State Tracking
TODO
