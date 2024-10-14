import { setActivePinia, createPinia } from "pinia";
import { useCommunities } from "./communities";
import { beforeEach, describe, expect, it } from "vitest";

describe("Communities", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Default value is empty value
  it("should have a default value", () => {
    const { communities } = useCommunities();
    expect(communities).toEqual([]);
  });
});
