import { vi } from "vitest";

export const mockGraphQL = {
  $graphql: vi.fn(() =>
    Promise.resolve({
      data: {
        getCommunities: [
          {
            _id: 1,
            name: "Community 1",
            acronym: "C1",
            description: "Description of Community 1",
            status: "active",
            keywords: ["keyword1"],
            links: [
              {
                uri: "https://example.com",
                comment: "Example link",
                label: "Example",
              },
            ],
            benchmarkingEvents: [{ _id: 1 }],
            _metadata: {},
          },
        ],
      },
    }),
  ),
};
