# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/99308d7c-b71e-48c5-8dbe-ce9369f7627a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/99308d7c-b71e-48c5-8dbe-ce9369f7627a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/99308d7c-b71e-48c5-8dbe-ce9369f7627a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Local full-stack setup (React + Spring Boot + SQL + ML)

This repository now includes a backend at [backend/](backend/).

### 1) Configure SQL (MySQL)

- Create DB: `agrilink_db` (or run [backend/database/init.sql](backend/database/init.sql))
- Update DB credentials in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)

### 2) Start backend

1. Open terminal in [backend/](backend/)
2. Run: `mvn spring-boot:run`

Backend URL: `http://localhost:8080`

### 3) ML prediction bridge

Backend calls [backend/ml/predict.py](backend/ml/predict.py). It can load a `.joblib` model if present; otherwise it uses fallback heuristic.

- Optional: install python deps from [backend/ml/requirements.txt](backend/ml/requirements.txt)
- Configure these in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
	- `app.ml.python-command`
	- `app.ml.script-path`
	- `app.ml.model-path`

### 4) Start frontend

1. Copy [.env.example](.env.example) to `.env`
2. Ensure `VITE_API_BASE_URL=http://localhost:8080/api`
3. Run frontend: `npm i` then `npm run dev`

### 5) Buttons now wired to backend

- Auth: signup/login uses backend + SQL sessions
- Farmer: add product + predict price saved via backend
- Aggregator: fetch/accept offers + OTP verify
- Admin: load stats + send announcement (stored in DB)
