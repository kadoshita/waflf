import fetch from 'node-fetch';

const res = await fetch('http://localhost:3000/hello', {
    method: 'post',
    body: JSON.stringify({ text: 'world' })
});
const data = await res.json();
console.log(res.status, res.url, data);