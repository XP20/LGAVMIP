import { Hono } from "hono";
const apiMOTD = new Hono();

const motds = ['Stabilāks par Latvija.lv!', 'Iedvesmots no VPS!', 'Labāks par EDS!', 'Ciešamāks par E-Veselību!', 'Vidusskolēnu veidots!']

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomMOTD() {
    let max = motds.length-1;
    let vards = motds[getRndInteger(0, max)];
    return vards;
}

apiMOTD.get('/', async (c) =>{
    let MOTD = getRandomMOTD();
    //console.log(MOTD);
    return c.json({MOTD}, 200);
})
export default apiMOTD;