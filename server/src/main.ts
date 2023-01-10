import express, { Application } from 'express';
import cors from 'cors';
import { z } from 'zod';
import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';

type User = {
  name: string;
};

type lastUser = {
  name: string;
  total: number;
};

const users: User[] = [];

function getUser(): lastUser {
  const total = users.length;
  const user = users[total - 1] ?? { name: '' };
  const name = user.name;
  return { name, total };
}

const app: Application = express();

app.use(express.json());
app.use(cors({}));

const port = process.env.PORT || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

const router = trpc
  .router()
  .query('getUser', {
    input: z.undefined(),
    async resolve(req) {
      return getUser();
    },
  })
  .mutation('createUser', {
    input: z.union([z.object({ name: z.string() }), z.undefined()]),
    async resolve(req) {
      const name = req.input?.name ?? 'Anonymous';
      users.push({ name });
      return getUser();
    },
  });

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({ router, createContext })
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

createHTTPHandler({
  router,
  createContext: () => null,
});

export type ApiRouter = typeof router;
