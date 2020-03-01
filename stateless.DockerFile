FROM node:10.15.1-alpine
RUN  apk add --no-cache git openssh
RUN npm install -g webpack webpack-cli babel
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
EXPOSE 80
CMD tail -f /dev/null