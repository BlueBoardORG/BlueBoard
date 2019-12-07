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

#### Docker Compose

use docker-compose to run development instance with automatic builds on code changes based on docker containers.

```shell
cd ./compose/
docker-compose -f "docker-compose-dev.yaml" up -d --build
```

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

SHRAGA_URL=http://localhost:3000 
CALLBACK_URL=http://localhost:1337/auth/shraga

# socket IO server url (remember - no http://)
REACT_APP_SOCKETLOCATION

# Has to be port 1337
ROOT_URL=http://127.0.0.1:1337
```

```shell
npm run build
npm run serve
```


### Production

#### Docker Compose

```shell
cd ./compose/
docker-compose -f "docker-compose.yaml" up -d --build
```

#### Full Setup

follow all above steps for full setup and run:

```shell
npm run build:prod
npm run serve:prod
```
