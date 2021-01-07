# Dogster backend

## Description

This is the underbelly of the app for owners of social dogs: Dogster.
The structure is based on the [Nest](https://github.com/nestjs/nest) TypeScript starter repository and was created while folloring the [NestJS-course](https://github.com/arielweinberger/nestjs-course-task-management) by Ariel Weinberger.

For general documentation of NestJS go [HERE](https://docs.nestjs.com/).


## Installation

```bash
$ npm install
```

## Database

Project requires a [Postgres](https://www.postgresql.org/download/) database that matches the configurations in `./config/*.yml`'s db-object.

## Config

General configurations are made in `.yml`-files in the `/config`-folder.

Critical production-level configuration variables will be exposed through environment.


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing
Unit tests are written in [Jest](https://jestjs.io/) which is bundled in NestJS with additional documentation [HERE](https://docs.nestjs.com/fundamentals/testing).
Test modules are created as ``{filename}.spec.ts`` and placed next to the file it tests.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author: [Anders Clark](https://github.com/andersclark)
- Twitter: [@andersclark](https://twitter.com/andersclark)

