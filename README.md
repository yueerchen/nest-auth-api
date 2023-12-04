# Nest.js User Login REST API

A simple user login REST API implemented using Nest.js, TypeScript, MongoDB, and Docker.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Testing](#testing)

## Introduction

This project implements a user authentication REST API using Nest.js, TypeScript, MongoDB, and Docker. It provides basic login functionality with JWT token generation, user lockout after failed attempts, and more.

## Features

- A user can login with a username and password (sign up was implemented for easily testing purpose)
- JWT token generation on successful login
- Return fail if username and password are not matched
- Account lockout after three unsuccessful login attempts within 5 minutes
- Return fail if a user is locked

## Project Structure

The project follows a standard Nest.js project structure:
```plaintext
nest-auth-api/
|-- src/
| |--dto/
| | |--login.dto.ts
| | |--signup.dto.ts
| |--schemas/
| | |--user.schema.ts
| |--test/
| | |--integration/
| | | |--auth.service.int-spec.ts
| |-- auth/
| |-- auth.module.ts
| |-- auth.service.ts
| |-- auth.controller.ts
| |-- main.ts
|-- mongodb/
| |-- Dockerfile
|-- redis/
| |-- Dockerfile
|-- Dockerfile
|-- docker-compose.yml
|-- .dockerignore
|-- jest-int.json
|-- .env
|-- tsconfig.json
|-- package.json
|-- README.md
```

## Requirements

- Node (v16.20.1 or later)
- npm or yarn
- Docker

## Usage

Follow .example.env to fulfill the .env file and then run

```bash
$ cd nestjs-user-auth
$ docker-compose up --build
```

## Testing

```bash
# unit test
$ yarn run test

# integration test
$ yarn run test:int
```
