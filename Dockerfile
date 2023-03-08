FROM node:latest

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

COPY package.json /usr/src/package.json

COPY yarn.lock /usr/src/yarn.lock

# install and cache app dependencies
RUN yarn install --ignore-engines

COPY . /usr/src/app

RUN yarn global add nodemon

# start app
CMD ["sh", "app/run.sh"]
