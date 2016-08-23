NodeJS Boilerplate
============

##[Demo]

Boilerplate in nodejs illustrating the use of **NodeJs** using **passport**, **express**, **handlebars** and **mongoose** environment
together with front pages for login, signup and profile mock, which can be used as a boilerplate in your app development! Some Inspired by WEB DEVELOPMENT WITH NODE AND EXPRESS By Ethan Brown
Fisrt boilerplate with great flexibility without using any front-end frameworks, just the functionality of the backend and plain frontend!
Prerequisite:
------------
1. Redis
2. Mongodb
3. Ngnix Preferred


QATest with:
------------
1. PAGE TESTS
2. CROSS PAGE TESTS
3. LOGIC TESTS
4. JSLINT TO PERFECT THE CODE
5. GRUNT TO AUTOMATE YOUR PROCESS

Includes login with Google together with Passport LocalStrategy

Full use of muti-core processor and speeding up your app
------------
We use cluster module to make full use of muti-core processor and speed up your app

Technology
------------

| On The Server | On The Client  | Test     | Database      |
| ------------- | -------------- | -------- | ------------- |
| Express       | html5          | Mocha    | Mongodb       |
| handlebars    | grunt          | Zombie   | Redis         |
| Passport      | sass           | Chai     |               |
| node-mailer   |                |          |               |
|               |                |          |               |
|               |                |          |               |


Installation
-------------

1. git clone https://github.com/thenodejsboilerplate/nodejs-boilerplate.git
2. mv config-default config && cd nodejs-boilerplate
3. npm install
4. create or modify config.js file under config folder
5. node app

Test and auto-work
-------------
1. grunt test
2. grunt

Debug
-------
1. npm install -g node-inspector
2. node-debug app.js




License
------------

MIT

