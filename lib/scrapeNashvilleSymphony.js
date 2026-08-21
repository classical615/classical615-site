// This file loads the Nashville Symphony's live ticketing calendar and turns it into
// a clean list of concerts. It uses a "headless browser" (a robot version of Chrome)
// because their calendar loads events with JavaScript after the page opens - a plain
// fetch() would only see an empty page.

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const EVENTS_URL = 'https://tickets.nashvillesymphony.org/events';

export async function scrapeNashvilleSymphony() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(EVENTS_URL, { waitUntil: 'networkidle2', timeout: 45000 });

    // Switch to "List View" - it's simpler to parse than the calendar grid.
    // The button has this class based on what we inspected from the saved page.
    const listViewButtonSelector = '[data-tn-events-listing-mode="list"], .tn-event-listing-mode-tab-nav__list-item a';
    try {
      await page.click(listViewButtonSelector);
    } catch {
      // If the button isn't found this way, the list view may already be showing - continue anyway.
    }

    // Wait for at least one concert to actually render.
    await page.waitForSelector('li.tn-prod-list-item', { timeout: 20000 });

    // Give it a moment to finish loading every concert (their site loads results in a batch).
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const events = await page.evaluate(() => {
      const results = [];
      const concertItems = document.querySelectorAll('li.tn-prod-list-item');

      concertItems.forEach((concert) => {
        const headingLink = concert.querySelector('h4.tn-prod-list-item__property--heading a');
        const title = headingLink ? headingLink.textContent.trim() : null;
        const infoLink = headingLink ? headingLink.getAttribute('href') : null;

        const descEl = concert.querySelector('div.tn-prod-list-item__property--description');
        const description = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';

        const perfItems = concert.querySelectorAll('li.tn-prod-list-item__perf-list-item');
        perfItems.forEach((perf) => {
          const dateEl = perf.querySelector('.tn-prod-list-item__perf-date');
          const timeEl = perf.querySelector('.tn-prod-list-item__perf-time');
          const anchor = perf.querySelector('a.tn-prod-list-item__perf-anchor');

          results.push({
            title,
            date: dateEl ? dateEl.textContent.trim() : null,
            time: timeEl ? timeEl.textContent.trim() : null,
            ticketLink: anchor ? anchor.getAttribute('href') : infoLink,
            infoLink,
            description: description.slice(0, 500),
            sourceId: perf.getAttribute('data-tn-performance-no'),
          });
        });
      });

      return results;
    });

    return events;
  } finally {
    await browser.close();
  }
}
