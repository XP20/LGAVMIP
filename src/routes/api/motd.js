import { Hono } from "hono";
const apiMOTD = new Hono();

const motds = ['Stabilāks par Latvija.lv!', 'Iedvesmots no VPS!', 'Labāks par EDS!', 'Ciešamāks par E-Veselību!', 'Vidusskolēnu veidots!', 'Neizmanto React!', 'Neizmanto Vue!', 'Neizmanto jQuery!', 'Neizmanto sīkdatnes!', 'Nav SaaS!', 'Hostots no veca laptopa!', 'Nenobrūk katru martu!', 'Neprasa eID karti!', 'Neprasa eParakstu!', 'Ieviests ātrāk par Rail Baltica!', 'Nav jāgaida līdz nākamajām vēlēšanām!', 'Strādā arī svētku dienās!', 'Neliek gaidīt e-rindā!', 'Nevajag iesniegt iesniegumu!', 'Nav jākārto spēlēšanas atļauja!', 'Netērē nodokļu maksātāju naudu!', 'Nav katru gadu jāveic jauns iepirkums!']

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
    return new Response(MOTD, { //JSON is for the weak
        headers: {
            'Content-Type': 'text/html'
    }
})
}
)

export default apiMOTD;