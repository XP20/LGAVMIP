import { Hono } from "hono";
const vardi = ['Laiva', 'Iela', 'Acs', 'Rudens', 'Auto']
const apiMP = new Hono();

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomSessionName(length) {
    let max = vardi.length-1;
    if (length<2) length = 2;
    let name = "";
    for (let index = 0; index < length; index++) {
        name += vardi[getRndInteger(0, max)];
    }
    return name;
}

apiMP.get('/createSession', async (c) =>{
    let sessionName = getRandomSessionName(2);
    console.log(sessionName);
})
export default apiMP;