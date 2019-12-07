FROM node:10.15.1-alpine AS node
RUN  apk add --no-cache git openssh
RUN npm install -g webpack webpack-cli babel
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN npm run build:prod
CMD npm run serve:prod

EXPOSE 1337
