# pujitha.dev

Portfolio of Muttineni Pujitha: plain HTML/CSS/JS, no build step.

- `data.js`: all content (bio, experience, skills, project case studies). Edit this file to update the site.
- `index.html` + `main.js`: home page.
- `project.html` + `project.js`: case-study template, served at `/projects/<slug>` (see `vercel.json`).
- `assets/`: résumé PDF.

## Run locally

    npx serve .

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → import the repo. Framework preset: **Other**. Leave build command and output directory empty.
3. Deploy.

Or with the CLI: `npm i -g vercel && vercel --prod` from this folder.
