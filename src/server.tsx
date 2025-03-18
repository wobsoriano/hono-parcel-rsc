import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static'
import { renderRequest, callAction } from '@parcel/rsc/server';
import { Todos } from './Todos';

// Page components. These must have "use server-entry" so they are treated as code splitting entry points.
import { Page } from './Page';
import { serve } from '@hono/node-server';

const app = new Hono();

app.use(serveStatic({ root: './dist' }))

app.get('/', (c) => {
  return renderRequest(c.req.raw, <Page />, { component: Page })
})

app.post('/', async (c) => {
  let id = c.req.header('rsc-action-id');
  let {result} = await callAction(c.req.raw, id);
  let root: any = <Page />;
  if (id) {
    root = {result, root};
  }
  const response = await renderRequest(c.req.raw, root, { component: Page });
  return response
});

app.get('/todos', (c) => {
  return renderRequest(c.req.raw, <Todos />, { component: Todos });
});

serve({
  fetch: app.fetch,
  port: 3000,
})