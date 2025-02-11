import { test, expect } from "@playwright/test";

test.describe("Homepage Tests", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
  });

  test("should load the homepage correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/OpenEBench/);
  });

  test("should display all main sections", async ({ page }) => {
    await expect(page.locator("section")).toHaveCount(6);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should allow searching in LandingSearcher", async ({ page }) => {
    const searchInput = page.locator("input[type='text']");
    await searchInput.fill("genomics");
    await searchInput.press("Enter");
    await expect(page.locator("iframe")).toBeVisible();
  });

  test("should display numbers in LandingNumbers", async ({ page }) => {
    await page.waitForSelector(".landing-numbers .landing-numbers-box", { timeout: 5000 });
    const numbers = page.locator(".landing-numbers .landing-numbers-box");
    const count = await numbers.count();
    expect(count).toBeGreaterThan(3);
  });

  test("should display the carousel with partner logos", async ({ page }) => {
    await page.waitForSelector(".landing-logos");
    await page.waitForSelector(".carousel__item", { timeout: 5000 });

    const carouselItems = page.locator(".carousel__item");
    const count = await carouselItems.count();

    expect(count).toBeGreaterThan(1);

    const firstImage = carouselItems.locator("img").first();
    await expect(firstImage).toBeVisible();
    await expect(firstImage).toHaveAttribute("src", /.+/);
  });

});
