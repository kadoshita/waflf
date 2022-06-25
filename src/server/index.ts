import http, { IncomingMessage, ServerResponse } from 'http';
import { WaflfOptions } from '..';

export type ServerOptions = {
    port?: number;
};

export type WaflfRequestResult = {
    ok: boolean;
    json: () => Promise<any>;
    res: (response: WaflfResponseResult) => Promise<void>;
};
export type WaflfResponseResult = {
    statusCode: number,
    headers: Record<string, string>;
    body: Record<string, any> | string;
};

export class Server {
    private server: http.Server;
    private readonly routeMapping: Map<string, { method: 'get' | 'post', route: string, handler: (req: WaflfRequestResult) => void, response?: ServerResponse; }>;
    constructor(options: ServerOptions) {
        this.routeMapping = new Map();
        this.server = http.createServer((req: IncomingMessage, res: ServerResponse) => this.handleRequest(req, res));
        const port = options.port || 3000;
        this.server.listen(port, () => {
            console.log(`server listening on ${port}`);
        });
    }

    private handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
        return new Promise((resolve, reject) => {
            const r = this.routeMapping.get(`${req.method?.toLowerCase()}-${req.url?.toLowerCase()}`);
            if (!r) {
                res.writeHead(404, {
                    "Content-Type": "text/html"
                }).end('Not Found');
                return;
            }

            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('readable', () => req.read());
            req.on('end', () => {
                r.response = res;
                r.handler({
                    ok: true,
                    json: () => {
                        return new Promise(resolve => {
                            return resolve(data);
                        });
                    },
                    res: (response: WaflfResponseResult) => {
                        return new Promise(resolve => {
                            res.writeHead(response.statusCode, response.headers).end(response.body, () => {
                                this.routeMapping.delete(`${r.method}-${r.route}`);
                                resolve();
                            });
                        });
                    }
                });
            });
        });
    }

    handler(path: string, options: WaflfOptions, handler: (req: WaflfRequestResult) => void) {
        this.routeMapping.set(`${options.method.toLowerCase()}-${path.toLowerCase()}`, { method: options.method, route: path, handler: handler });
    }

    close() {
        this.server.close();
    }
}