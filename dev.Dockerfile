FROM node:14-alpine
WORKDIR /usr/src/app/test
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
RUN npm install knex -g
COPY . .
EXPOSE 5001
CMD ["npm", "run", "start"]