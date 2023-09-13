## Installation

Install Docker https://www.docker.com/products/docker-desktop/

```bash
$ npm install

$ cp .env.example .env
#fill all the variables values in .env file except those which start with POSTGRES
#unless you make chages to postgres to docker-compose.yml

$ npm run db:dev:up

$ npm run migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

$ cp .env.example .env.test
#fill all the variables values in .env file
#provide 5433 for POSTGRES_PORT (this is test db port in docker)

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

