//also to DB in the future for each gamemode
let panoRadii = [50, 50, 50, 1000];


const apiInfo = new Hono()
    .get('/:id', async (c) => {
        let id = parseInt(c.req.param('id'));
        let a = {radius: panoRadii[id]};
        return c.json(a);
    });

export default apiInfo;