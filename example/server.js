const { waflf, waflfInit } = require('waflf');

waflfInit({ port: 3000 });

(async () => {
    console.log('server start');
    for (; ;) {
        console.log('request waiting...');
        const helloRoute = await waflf('/hello', {
            method: 'post',
        });
        console.log('request received');
        const req = await helloRoute.json();
        console.log(req);
        await helloRoute.res({
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ result: 'ok' })
        });
        console.log('request done');
    }
})();
