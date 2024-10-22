// src/server/api/routers/screenshot.ts
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import puppeteer from "puppeteer";

export const screenshotRouter = createTRPCRouter({
  capture: publicProcedure
    .input(
      z.object({
        selector: z.string(),
        // 必要に応じて追加のパラメータを定義
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
        // 開発環境のURLを指定
        await page.goto('http://localhost:3000/profile');
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
