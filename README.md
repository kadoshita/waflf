# waflf

The Web Application Framework like fetch

# Example

```js
const { default: waflf, init: waflfInit } = require('waflf');

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

// curl -X POST http://localhost:3000/hello -d '{"message":"hi!"}'
// => {"result":"ok"}
```