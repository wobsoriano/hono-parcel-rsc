import { Hono } from 'hono';
import { renderRequest, callAction } from '@parcel/rsc/server';
import { serve } from '@hono/node-server';
import { Todos } from './Todos';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();
app.use(serveStatic({ root: 'dist' }));

app.get('/', (c) => {
	return renderRequest(c.req.raw, <Todos />, { component: Todos });
});

app.post('/', async (c) => {
	let id = c.req.header('rsc-action-id');
	let { result } = await callAction(c.req.raw, id);
	let root: any = <Todos />;
	if (id) {
		root = { result, root };
	}
	return renderRequest(c.req.raw, root, { component: Todos });
});

app.get('/todos/:id', (c) => {
	const id = c.req.param('id');
	return renderRequest(c.req.raw, <Todos id={Number(id)} />, {
		component: Todos,
	});
});

app.post('/todos/:id', async (c) => {
	let id = c.req.header('rsc-action-id');
	let { result } = await callAction(c.req.raw, id);
	let root: any = <Todos id={Number(c.req.param('id'))} />;
	if (id) {
		root = { result, root };
	}
	return renderRequest(c.req.raw, root, { component: Todos });
});

serve({
	fetch: app.fetch,
	port: 3000,
});
