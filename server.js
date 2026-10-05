'use strict';

const http = require('http');
const url = require('url');

const { DateUtils, FileUtils } = require('./modules/utils');
const EnglishMessages = require('./lang/en/en');

class Server {
    constructor() {
        this.port = process.env.PORT || 8080;

        this.dateUtils = new DateUtils();
        this.fileUtils = new FileUtils();

        this.fileName = 'file.txt';
    }

    start() {
        this.server = http.createServer((request, response) => {
            this.handleRequest(request, response);
        });

        this.server.listen(this.port, '0.0.0.0', () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    handleRequest(request, response) {
        const parsedUrl = url.parse(request.url, true);

        const path = parsedUrl.pathname;
        const query = parsedUrl.query;

        if (path === '/COMP4537/labs/4/getDate/') {
            this.handleGetDate(response, query);
        }

        else if (path === '/COMP4537/labs/4/writeFile/') {
            this.handleWriteFile(response, query);
        }

        else if (path === '/COMP4537/labs/4/readFile/file.txt') {
            this.handleReadFile(response);
        }

        else {
            this.handle404(response, path);
        }
    }

    handleGetDate(response, query) {
        const name = query.name;

        if (!name) {
            response.writeHead(400, {
                'Content-Type': 'text/plain'
            });

            response.end('Please provide a name.');
            return;
        }

        const greeting =
            EnglishMessages.GREETING.replace('%1', name);

        const currentDate =
            this.dateUtils.getDate();

        const message =
            `${greeting} ${currentDate}`;

        const html = `
            <p style="color: blue;">
                ${message}
            </p>
        `;

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        response.end(html);
    }

    handleWriteFile(response, query) {
        const text = query.text;

        if (!text) {
            response.writeHead(400, {
                'Content-Type': 'text/plain'
            });

            response.end('Please provide text.');
            return;
        }

        this.fileUtils.appendToFile(
            this.fileName,
            text,
            (error) => {

                if (error) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(
                        'Error writing to file.'
                    );

                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end(
                    `${text} was added to ${this.fileName}`
                );
            }
        );
    }

    handleReadFile(response) {
        this.fileUtils.readFile(
            this.fileName,
            (error, data) => {

                if (error) {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(
                        `404 - ${this.fileName} was not found.`
                    );

                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end(data);
            }
        );
    }

    handle404(response, path) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        response.end(
            `404 - ${path} was not found.`
        );
    }
}

const server = new Server();
server.start();