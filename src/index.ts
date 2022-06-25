import { Server, WaflfRequestResult } from './server';

let server: Server | undefined;

export type WaflfInitOptions = {
    port: number;
};

export type WaflfOptions = {
    method: 'get' | 'post';
};

export const init = (options: WaflfInitOptions) => {
    server = new Server({ port: options.port });
};

export const close = () => {
    server?.close();
};

const main = (path: string, options: WaflfOptions): Promise<WaflfRequestResult> => {
    return new Promise((resolve, reject) => {
        if (server === undefined) {
            server = new Server({ port: 3000 });
        }
        server.handler(path, options, (request: WaflfRequestResult) => {
            resolve(request);
        });
    });
};

export default main;
