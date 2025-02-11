import { test, expect } from "@playwright/test";

test.describe("Homepage Tests", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/OpenEBench/);
  });

  test("should display all main sections", async ({ page }) => {
    await expect(page.locator("section")).toHaveCount(7);
    console.log("Sections found: ", await page.locator("section").count());
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should allow searching in LandingSearcher", async ({ page }) => {
    const searchInput = page.locator("input[type='text']");
    await searchInput.fill("genomics");
    await searchInput.press("Enter");
    
    // ✅ Verify that the search results appear (replace with a real selector)
    await expect(page.locator(".search-results")).toBeVisible();
  });

  test("should display numbers in LandingNumbers", async ({ page }) => {
    const numbers = page.locator(".langing-numbers div");
    await expect(numbers).toHaveCount(4); // ✅ Ensure there are 4 numerical sections
  });

  test("should display logos in LandingLogos", async ({ page }) => {
    const logos = page.locator(".landing-logos img");
    await expect(logos).toHaveCountGreaterThan(3); // ✅ Ensure at least 3 logos are visible
  });

});
