FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm cache clean --force
RUN npm install --force
COPY . /app
CMD ["npm", "start"]
