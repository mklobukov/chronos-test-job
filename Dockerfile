FROM node:8-alpine

COPY main.js index.js

CMD [ "node", "index.js" ]
