import { setActivePinia, createPinia } from 'pinia';
import { useCommunities } from '@/stores/communities.js';
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
});
