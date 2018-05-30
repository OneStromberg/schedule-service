FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/scheduler
WORKDIR /usr/src/scheduler

# Install app dependencies
COPY package.json /usr/src/scheduler/
RUN npm install

# Bundle app source
COPY . /usr/src/scheduler

EXPOSE 8091
CMD [ "node", "index.js" ]