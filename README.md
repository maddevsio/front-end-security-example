# Front-end security example
[![Developed by Mad Devs](https://maddevs.io/badge-dark.svg)](https://maddevs.io/blockchain/)

[//]: # TODO add links to writeup

> [!NOTE]
> This repository was developed as a practical example for an article [Secure from the start: Building a hack-proof Front-end app](url-to-writeup).

This project demonstrates how to implement main web security principles at Front-end

We used [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack) boilerplate as a basis for the app. Great thanks to the authors.

The app uses React, Node.js, Express and Webpack. It is also configured with webpack-dev-server, eslint, prettier and babel.

This is a simple full stack [React](https://reactjs.org/) application with a [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) backend. Client side code is written in React and the backend API is written using Express. This application is configured with [Airbnb's ESLint rules](https://github.com/airbnb/javascript) and formatted through [prettier](https://prettier.io/).

## Quick Start
- Clone this repo
- Run:
```bash
npm install
npm run server
npm run client
```

credentials for entering the app:
```
username: 'administrator', 
password: 'Admin!123'
```

[//]: # (TODO:)
- file uploading, especially XML, ZIP and CSV.
- Scrutinize redirects and ads.
- encrypt user data before sending to server
- set integrity and crossorigin attributes to script and link tags.
- Hide your web server version