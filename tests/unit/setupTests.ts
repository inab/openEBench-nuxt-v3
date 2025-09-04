import { setupServer } from 'msw/node';
import { rest } from 'msw';

setupServer(
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { name: 'John Doe' },
        oeb_roles: [],
      })
    );
  })
);
