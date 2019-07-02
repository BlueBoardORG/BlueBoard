<!-- Description: A Trello-like application built with React and Redux. Take a look at the live website:  -->

# Blue Board

A server-rendered React app inspired by [Trello](https://trello.com/home).

![react kanban example](https://github.com/yogaboll/react-kanban/blob/master/example.gif?raw=true)

### Features

* It has most of the features available on Trello, like creating and editing new cards, dragging around cards and so on.
* Supports GitHub flavored markdown, which enables stuff like headings and checklists on the cards.
* Works great on touch devices.

### Tech stack

* [React](https://github.com/facebook/react)
* [Redux](https://github.com/reactjs/redux)
* [React-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
* [Sass](https://github.com/sass/sass)
* [Webpack](https://github.com/webpack/webpack)
* [Babel](https://github.com/babel/babel)
* [Express](https://github.com/expressjs/express)
* [MongoDB](https://github.com/mongodb/mongo)
* [Passport](https://github.com/jaredhanson/passport)


### Development

Setting up the full app with your own mongoDB instance  requires significant effort.

#### Full setup

```shell
git clone https://github.com/ShragaUser/BlueBoard.git

cd BlueBoard

npm install
```
#### Important

Needs to be used with this REPO running: 
https://github.com/ShragaUser/kanbanSocketIOConnector

this REPO is responsible for making the app work with real time updates. 
clone and run. 

```
git clone https://github.com/ShragaUser/kanbanSocketIOConnector.git
cd kanbanSocketIOConnector
npm install
npm start
```

it should be used with the same .env file as described below.

#### Environment Variables
You need to add your own mongoDB url as well as other things for adfs and the likes. You need to create a file with the name `.env` in the root directory with the following variables:

```
MONGODB_URL
MONGODB_NAME
# important - can be any value
SESSION_SECRET

# for ADFS only:
SAML_ENTRY_POINT
SAML_ISSUER
SAML_CALLBACK_URL
# for ADFS claims:
PROFILE_EXTRACTOR_ID
PROFILE_EXTRACTOR_FIRST_NAME
PROFILE_EXTRACTOR_LAST_NAME
PROFILE_EXTRACTOR_MAIL
PROFILE_EXTRACTOR_DISPLAY_NAME

# socket IO server url (remember - no http://)
REACT_APP_SOCKETLOCATION

# metadata file location:
METADATA_FILE



# Has to be port 1337
ROOT_URL=http://127.0.0.1:1337
```

```shell
npm run build
npm run serve
```

For production deployment run:

```shell
npm run build:prod
npm run serve:prod
```
