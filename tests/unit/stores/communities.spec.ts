import { setActivePinia, createPinia } from 'pinia';
import { useCommunities } from '~~/stores/communities.js';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Communities', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Default value is empty value
  test('can have a default value', () => {
    const { communities } = useCommunities();
    expect(communities).toEqual([]);
  });

  test('formats metadata returned as either a JSON string or an object', async () => {
    const store = useCommunities();
    const formatted = await store.formatData([
      {
        _id: 'community',
        status: 'active',
        _metadata: '{"project_spaces":false}',
      },
      {
        _id: 'project',
        status: 'active',
        _metadata: { project_spaces: true },
      },
    ]);

    expect(formatted.map((entry) => entry._metadata)).toEqual([
      { project_spaces: false },
      { project_spaces: true },
    ]);
    expect(store.filterCommunities(formatted).map((entry) => entry._id)).toEqual([
      'community',
    ]);
    expect(store.filterProjects(formatted).map((entry) => entry._id)).toEqual([
      'project',
    ]);
  });
});
