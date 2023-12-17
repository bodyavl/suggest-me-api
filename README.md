## Installation

Install Docker https://www.docker.com/products/docker-desktop/

```bash

$ npm i -g pnpm

$ pnpm install

$ cp .env.example .env
#fill all the variables values in .env file except those which start with POSTGRES
#unless you make chages to postgres to docker-compose.yml

$ pnpm run db:dev:up

$ pnpm run migration:run
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

$ cp .env.example .env.test
#fill all the variables values in .env file
#provide 5433 for POSTGRES_PORT (this is test db port in docker)

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

