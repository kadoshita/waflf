import { Server, WaflfRequestResult } from './server';
const server = new Server();

export type WaflfOptions = {
    method: 'get' | 'post';
};
const main = (path: string, options: WaflfOptions) => {
    return new Promise((resolve, reject) => {
        server.handler(path, options, (request: WaflfRequestResult) => {
            resolve(request);
        });
    });
};
export default main;

module.exports = main;