// src/server/api/routers/screenshot.ts
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import puppeteer from "puppeteer";

export const screenshotRouter = createTRPCRouter({
  capture: publicProcedure
    .input(
      z.object({
        selector: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      let browser;
      try {
        browser = await puppeteer.launch();
      } catch (error) {
        console.error('ブラウザの起動に失敗しました:', error);
        throw new Error('ブラウザの起動に失敗しました');
      }
      const page = await browser.newPage();
      
      try {
        await page.goto('https://ado-min.vercel.app/profile');
        const element = await page.$(input.selector);
        
        if (!element) {
          throw new Error('Element not found');
        }

        const screenshot = await element.screenshot({
          encoding: "base64"
        });

        return { image: `data:image/png;base64,${screenshot}` };
      } finally {
        await browser.close();
      }
    }),
});
