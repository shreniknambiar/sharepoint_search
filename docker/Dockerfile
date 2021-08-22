FROM node:14.15.4-alpine

WORKDIR /zurich_search

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . ./

EXPOSE 3000
EXPOSE 9200

CMD npm start
