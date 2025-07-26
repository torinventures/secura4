# Backend Documentation

This is the backend documentation for Base Backend Setup using HapiJS.

## Description
### This project contains the following features - 
-	Hapi JS backend
-	Eslint (Airbnb standards)
-	Pluggable Architecture
-	Joi Validations
-	Swagger Documentation
-	JWT Authentication
-	Multiple environment setup
-	Husky (For pre commit code checking)
-	API Versioning
-	Unit test cases using Mocha and Chai
-	Logger (Bunyan)
-	Log Rotation

This project contains multi-env setup.

The environment variables can be set in the following files for the environments mentioned alongside

| Environment | Environment File Name |
|-------------|-----------------------|
| Development | .development.env      |
| Staging     | .staging.env          |
| Production  | .production.env       |
| Test        | .test.env             |

## Prerequisites
- Node JS – version 16.x.x
- npm – version 9.x.x

## Installation & Setup

Clone the repository from https://github.com/AayushGour/hapijs.git

Run the following commands to setup the project

```bash
npm i
npm run prepare
```

## Usage

| Command | Function |
|---|---|
| npm run start | Starts development server |
| npm run start:dev | Starts development server with Nodemon |
| npm run stag | Starts Staging server |
| npm run prod | Starts Production server |
| npm run test | Runs test cases |
| npm run test:coverage | Runs test cases and gets coverage |
| npm run lint | Runs linter to check for errors/warnings |
| npm run lint:fix | Fixes (some) lint issues |
| npm run prepare | Setup Husky for pre-commit code checking |

