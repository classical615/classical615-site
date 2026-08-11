# Classical 615 Website — Setup Guide

**Note:** This version uses your real brand — black and white with a red
accent, your logo, and the "Bungee" font that matches your lettering.
Tagline: "Your classical music hub in Nashville, TN."


Hi Kaitlyn! This is written for someone who's never coded beyond tweaking a
MySpace page — no coding required from you here. Think of this like
following a recipe: a few boxes to fill in, a few buttons to click.

## What this actually is

This folder is a website. Right now it only lives on my computer (Claude's),
not the internet. To make it a real, live website, you need to do two
things:

1. **Give it a key to your Airtable** so it can read your approved events.
2. **Put it online** using a free service called Vercel.

That's it. Once it's set up, your workflow doesn't change at all — you
approve events in Airtable exactly like you do now, and they'll show up on
the website automatically within a few minutes.

---

## Part 1: Get your Airtable key

Airtable calls this a "Personal Access Token" — think of it as a password
that lets the website (and only the website) read your event data.

1. Go to **airtable.com/create/tokens** and log in.
2. Click **Create new token**.
3. Name it something like `Classical 615 Website`.
4. Under **Scopes**, add: `data.records:read`
5. Under **Access**, choose your Classical 615 base (the one with your
   Events and Contacts tables).
6. Click **Create token**. It'll show you a long code starting with `pat...`
   — **copy it and paste it somewhere safe right now**. Airtable only shows
   it to you once.

## Part 2: Find your Base ID

1. Open your Classical 615 base in a browser.
2. Look at the web address bar at the top. It'll look like:
   `airtable.com/appXXXXXXXXXXXXXX/...`
3. Copy the part that starts with `app` — that's your Base ID.

## Part 3: Check your table and view names match

This website expects:
- A table called **Events**
- A view inside it called **Approved / Public**

If yours are named exactly that (they are, based on your screenshots),
you don't need to change anything. If you ever rename them, you'll update
two lines in a settings file — I'll show you where below.

## Part 4: Also update the "Submit an Event" link

Open `components/SiteHeader.tsx` in any text editor (even TextEdit or
Notepad works) and find this line near the bottom:

```
href="https://airtable.com/your-submission-form-link"
```

Replace the link inside the quotes with the real shareable link to your
"Classical 615 Concert Submission" form in Airtable (in Airtable, open that
form view and look for a **Share form** button — it'll give you a link).

## Part 5: Put it online with Vercel (free)

Vercel is a service made specifically for hosting sites like this one — it's
free for a site like yours.

1. Go to **vercel.com** and sign up (you can use your email or a GitHub
   account — if you don't have GitHub, email is fine for now, but ask me
   later about GitHub if you want easier future updates).
2. Once logged in, look for a button like **Add New → Project**.
3. It'll ask you to upload or connect your project folder — this whole
   `classical615-site` folder. If it asks you to connect GitHub instead,
   let me know and I'll walk you through the couple extra steps to put
   this folder on GitHub first (it's just a place to store the folder
   online).
4. Before you click the final "Deploy" button, Vercel will show a section
   called **Environment Variables**. Add these four, using the values from
   Parts 1–3 above:

   | Name | Value |
   |---|---|
   | `AIRTABLE_API_KEY` | the `pat...` code from Part 1 |
   | `AIRTABLE_BASE_ID` | the `app...` code from Part 2 |
   | `AIRTABLE_EVENTS_TABLE` | `Events` |
   | `AIRTABLE_PUBLIC_VIEW` | `Approved / Public` |

5. Click **Deploy**. Wait a minute or two — Vercel is building your site.
6. When it's done, you'll get a real web address like
   `classical615.vercel.app`. That's your live site!

You can also connect a custom domain (like `classical615.com`) later from
the Vercel project settings, if you own one or want to buy one.

---

## How it works day to day

Nothing changes about how you use Airtable. When you move an event's status
to your **Approved / Public** view, it'll appear on the website within about
5 minutes (that's a deliberate delay so the site doesn't check Airtable too
often — Airtable limits how many times per minute you can ask it for data).

## What shows on the site vs. what stays private

Only these fields ever leave Airtable and reach a visitor's browser:
concert name, presenter, ensemble/organization, date, start time, location,
ticket price, ticket URL, and tags. Status, submission source, submitted
notes, contact email, internal notes, and created-by never leave your
Airtable base — they're filtered out before the website even asks for data.

## If something looks broken

- **Site says "Could not load events right now"** — double check the four
  values you entered in Vercel's Environment Variables match exactly
  (no extra spaces, no quote marks).
- **A concert doesn't show up** — check it's actually in your
  "Approved / Public" view in Airtable, and that it has both a Concert Name
  and a Date filled in (those two are required for it to appear).
- **You renamed a table or view in Airtable** — go to your Vercel project →
  Settings → Environment Variables and update `AIRTABLE_EVENTS_TABLE` or
  `AIRTABLE_PUBLIC_VIEW` to match the new name, then redeploy.

## If you want to change how it looks

Come back to me — tell me what you want different (colors, wording,
layout) and I can make the change and hand you an updated folder. You
never need to touch the code yourself.
