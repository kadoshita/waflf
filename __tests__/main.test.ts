import waflf, { close, init } from '../src';
import fetch from 'node-fetch';

describe('simple server', () => {
    beforeAll(() => {
        init({ port: 4000 });
    });
    afterAll(() => {
        close();
    });

    test('get request response', async () => {
        const server = new Promise<void>(async (resolve) => {
            const route = await waflf('/test', {
                method: 'get'
            });
            const req = await route.json();
            await route.res({
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ result: 'ok' })
            });
            expect(route.ok).toBe(true);
            resolve();
        });
        const client = new Promise<void>(async (resolve) => {
            const res = await fetch('http://localhost:4000/test', {
                method: 'get'
            });
            const data = await res.json();
            expect(data).toStrictEqual({ result: 'ok' });
            expect(res.ok).toBe(true);
            expect(res.status).toBe(200);
            resolve();
        });

        await Promise.all<void>([server, client]);
    });

    test('post request response', async () => {
        const server = new Promise<void>(async (resolve) => {
            const route = await waflf('/test', {
                method: 'post'
            });
            const req = await route.json();
            await route.res({
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ result: 'ok' })
            });
            expect(req).toBe(JSON.stringify({ data: 'test' }));
            expect(route.ok).toBe(true);
            resolve();
        });
        const client = new Promise<void>(async (resolve) => {
            const res = await fetch('http://localhost:4000/test', {
                method: 'post',
                body: JSON.stringify({ data: 'test' })
            });
            const data = await res.json();
            expect(data).toStrictEqual({ result: 'ok' });
            expect(res.ok).toBe(true);
            expect(res.status).toBe(200);
            resolve();
        });

        await Promise.all<void>([server, client]);
    });

    test('multiple handler', async () => {
        const server1 = new Promise<void>(async (resolve) => {
            const route = await waflf('/test', {
                method: 'post'
            });
            const req = await route.json();
            await route.res({
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ result: 'ok' })
            });
            expect(req).toBe(JSON.stringify({ data: 'test' }));
            expect(route.ok).toBe(true);
            resolve();
        });
        const server2 = new Promise<void>(async (resolve) => {
            const route = await waflf('/test2', {
                method: 'post'
            });
            const req = await route.json();
            await route.res({
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ result: 'good' })
            });
            expect(req).toBe(JSON.stringify({ data: 'test2' }));
            expect(route.ok).toBe(true);
            resolve();
        });
        const client1 = new Promise<void>(async (resolve) => {
            const res = await fetch('http://localhost:4000/test', {
                method: 'post',
                body: JSON.stringify({ data: 'test' })
            });
            const data = await res.json();
            expect(data).toStrictEqual({ result: 'ok' });
            expect(res.ok).toBe(true);
            expect(res.status).toBe(200);
            resolve();
        });
        const client2 = new Promise<void>(async (resolve) => {
            const res = await fetch('http://localhost:4000/test2', {
                method: 'post',
                body: JSON.stringify({ data: 'test2' })
            });
            const data = await res.json();
            expect(data).toStrictEqual({ result: 'good' });
            expect(res.ok).toBe(true);
            expect(res.status).toBe(200);
            resolve();
        });

        await Promise.all<void>([server1, client1, server2, client2]);
    });
});
describe('init test', () => {
    test('check test runner', () => {
        expect(true).toBe(true);
    });
});