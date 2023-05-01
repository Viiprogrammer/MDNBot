# MDN Search bot
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

## Screenshots

![Screenshot1](https://raw.githubusercontent.com/Viiprogrammer/MDNBot/main/media/example.gif)

# Features
- Written with [Opengram](https://github.com/OpengramJS/opengram)
- docker-compose, pm2 configs
- Deta space ready
- [i18next](https://www.i18next.com/) for internalization

## Deploy to deta space
[![Deploy](https://button.deta.dev/1/svg)](https://deta.space/discovery/r/jqdcdjl9geqxnjf4)

- Click deploy button and install
- Go to deta canvas, micro settings -> Configuration, set `BOT_TOKEN` and save changes

## Deploy with pm2

- Setup `.env`:
  - Copy env example:
  ```bash
  cp .env.example .env
  ```
  - Edit `BOT_TOKEN`


- Install dependencies
  Run `npm ci`
- Run application
  Run `pm2 start` in project directory

## Deploy with docker-compose
- Setup `.env`:
  - Copy env example:
  ```bash
  cp .env.example .env
  ```
  - Edit `BOT_TOKEN`

- Run `docker compose up -d`
