# Status — Where Are We?

Show the team their progress.

## Instructions

1. Read `.rally-progress` — get pages built and planned
2. Read `.team-name` — personalize
3. Read `.team-track` — show track
4. Read `rally.config.json` — show shell and theme
5. Read `DOMAIN.md` — show business name
6. Read `.rally-port` — include localhost link
7. Use Glob to check what page folders exist in `src/app/` (excluding layout.tsx and page.tsx in root)

### Print a status card:

```
Team: [name]
Track: [track]
App: http://localhost:[PORT]

Shell: [dashboard/mobile/portfolio]
Theme: [ocean/sunset/forest/berry/slate]

Pages built:
  [checkmark] Dashboard
  [checkmark] Customers
  [ ] Orders (not started)
  [ ] Analytics (not started)

Phase: [Design / Build / Polish / Demo Prep]
```

Then suggest next action:
- If pages remain: "Ready to build the **[next page]** page?"
- If all pages done: "All pages built! Type **/polish** to make it shine, or **/demo** to prep your pitch."
- If already polished: "Looking great! Type **/demo** to write your presentation script."
