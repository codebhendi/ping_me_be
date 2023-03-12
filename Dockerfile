FROM node:latest

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json

COPY yarn.lock /usr/src/app/yarn.lock

COPY gulpfile.js /usr/src/app/gulpfile.js

# install and cache app dependencies
RUN yarn install --ignore-engines

COPY . /usr/src/app

# start app
CMD ["yarn", "run", "start"]
