FROM node:14.16.0-alpine3.10

WORKDIR /usr/silver_waffle

COPY ["package.json", "."]
COPY ["package-lock.json", "."]

RUN ["npm", "ci"]

COPY . .

RUN ["npm", "run", "prod:build"]

CMD ["npm", "run", "prod:start"]
