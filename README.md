# AWS SQS Tutorial

[![Action Status](https://github.com/xahhy/aws-sqs-cli/workflows/Node.js%20Test/badge.svg)](https://github.com/xahhy/aws-sqs-cli/actions)
[![npm](https://img.shields.io/npm/v/aws-sqs-cli)](https://www.npmjs.com/package/aws-sqs-cli)
![npm](https://img.shields.io/npm/dw/aws-sqs-cli)
![GitHub](https://img.shields.io/github/license/xahhy/aws-sqs-cli)
![GitHub top language](https://img.shields.io/github/languages/top/xahhy/aws-sqs-cli)
![GitHub repo size](https://img.shields.io/github/repo-size/xahhy/aws-sqs-cli)
![GitHub last commit](https://img.shields.io/github/last-commit/xahhy/aws-sqs-cli)
![node](https://img.shields.io/node/v/aws-sqs-cli)

This project is aimed at the beginner of using AWS SQS service.

It's a pretty _command-line_ program to **send/receive/delete** SQS messages using javascript **aws-sdk**

![menu.jpg](./src/assets/unicorn.jpg)

## Usage

Clone this repo and run `npm start`

Follow the command-line hint:

- Type in your queue name
- Select the action you want
- Have fun!

![menu.jpg](./src/assets/menu.jpg)

## Use Globally

Run `npm link` to link current package to global package. Then run `aws-sqs-cli` in the command-line

## Develop

1. Run `npm run dev`. Program is waiting for debugger to connect to `localhost:9229`
2. Open your favorite debug tool to remote debug with `localhost:9229`

## Publish

Using GitHub Action to publish this `aws-sqs-cli` package. It's configured to automatic publish package with `v*` tag matches.

- Update package version using `npm version v1.0.0`
- `git push`
