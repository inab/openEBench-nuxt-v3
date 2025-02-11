import { setupServer } from "msw/node";
import { rest } from "msw";

// Define request handlers and response resolvers
const server = setupServer(
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(
      ctx.json({
        user: { name: "John Doe" },
        oeb_roles: [],
      }),
    );
  }),
);

// // Establish API mocking before all tests
// beforeAll(() => server.listen());

// // Reset any request handlers that are declared as a part of our tests
// // (i.e. for testing one-time error scenarios)
// afterEach(() => server.resetHandlers());

// // Clean up after the tests are finished
// afterAll(() => server.close());
