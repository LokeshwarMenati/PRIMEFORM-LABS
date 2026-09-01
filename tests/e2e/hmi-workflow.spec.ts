import { test, expect } from "@playwright/test";

test.describe("VMC Operator HMI Startup & Operation Workflow E2E", () => {
  test("Completes 6-stage startup workflow from POWER ON to RUNNING and STOPPED", async ({ page }) => {
    // 1. Open HMI
    await page.goto("http://localhost:3000");
    await expect(page.locator("body")).toContainText("PRIMEFORM LABS");
    await expect(page.locator("body")).toContainText("POWER ON & SCENARIO OVERVIEW");

    // 2. Begin Machine Checks
    await page.click("button:has-text('BEGIN MACHINE CHECKS')");
    await expect(page.locator("body")).toContainText("MACHINE CHECKS");

    // Confirm all 6 machine checks
    for (let i = 0; i < 6; i++) {
      const confirmButton = page.locator("button:has-text('CONFIRM CHECK')");
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(300);
      }
    }

    // Advance to Required Tools
    await page.click("button:has-text('NEXT: REQUIRED TOOLS')");
    await expect(page.locator("body")).toContainText("REQUIRED TOOLS SETUP");

    // Confirm all 4 tools
    for (let i = 0; i < 4; i++) {
      const confirmToolBtn = page.locator("button:has-text('CONFIRM TOOL INSERTION')");
      if (await confirmToolBtn.isVisible()) {
        await confirmToolBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Advance to Workpiece Setup
    await page.click("button:has-text('NEXT: WORKPIECE SETUP')");
    await expect(page.locator("body")).toContainText("WORKPIECE SETUP");

    // Confirm all 4 workpiece setup steps
    for (let i = 0; i < 4; i++) {
      const confirmWpBtn = page.locator("button:has-text('CONFIRM WORKPIECE SETUP STEP')");
      if (await confirmWpBtn.isVisible()) {
        await confirmWpBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Advance to Ready Review
    await page.click("button:has-text('NEXT: READY REVIEW')");
    await expect(page.locator("body")).toContainText("MACHINE READY FOR OPERATION");
    await expect(page.locator("body")).toContainText("✓ 6/6 Checks Confirmed");

    // Proceed to Operation
    await page.click("button:has-text('PROCEED TO OPERATION')");
    await expect(page.locator("body")).toContainText("READY TO START");

    // Start Operation
    await page.click("button:has-text('START OPERATION')");
    await expect(page.locator("body")).toContainText("RUNNING");

    // Stop Operation
    await page.click("button:has-text('STOP OPERATION')");
    await expect(page.locator("body")).toContainText("STOPPED");
    await expect(page.locator("body")).toContainText("Simulation stopped. Latest workflow state preserved.");
  });
});
