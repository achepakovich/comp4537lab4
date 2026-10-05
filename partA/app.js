'use strict';

const http = require('http');
const MathModule = require('./math');

class App {
    constructor() {
        this.math = new MathModule();
        this.port = 8080;
    }

    start() {
        http.createServer((request, response) => {
            const num1 = 10;
            const num2 = 5;

            const sum = this.math.add(num1, num2);
            const difference = this.math.subtract(num1, num2);

            console.log(`Andrei: ${num1} + ${num2} = ${sum}`);
            console.log(`Andrei: ${num1} - ${num2} = ${difference}`);

            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            response.end(
                `Andrei: sum = ${sum}, difference = ${difference}`
            );
        }).listen(this.port);

        console.log(`Listening on port ${this.port}...`);
    }
}

const app = new App();
app.start();