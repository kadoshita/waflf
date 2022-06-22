const { default: waflf } = require('waflf');

(async () => {
    for (; ;) {
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
