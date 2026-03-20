# Polish — Make It Shine

Switch to polish mode for the final stretch.

## Instructions

1. Read `.rally-port` — use this port for ALL localhost links
2. Read `.rally-progress` — see what pages are built
3. Read `DOMAIN.md` — understand the business

### Polish Checklist

Walk through each item, doing them one at a time. After each change, tell them to refresh and ask if it looks good.

1. **Mock data upgrade** — Replace any placeholder text ("Lorem ipsum", "Item 1", etc.) with realistic data using generators from `src/lib/mockData.ts`. Real names, plausible numbers, proper dates.

2. **Visual consistency** — Check all pages use the same shell, same theme colors, consistent spacing. Fix anything that looks off.

3. **Empty states** — Add EmptyState components where a list or table could be empty. Looks polished even with no data.

4. **Page titles** — Every page should have a PageHeader with a clear title and subtitle.

5. **Number formatting** — Dollar amounts formatted with `$` and commas. Dates human-readable. Percentages with `%`.

6. **Final walkthrough** — Open each page at localhost and verify it looks clean.

After polish, ask:
> "Looking good! Ready to prep your demo? Type **/demo** and I'll write your presentation script."

### Time Check
If they have less than 15 minutes left, skip polish and go straight to demo prep:
> "We have [N] minutes left — let's use that for your demo script. Type **/demo**!"
