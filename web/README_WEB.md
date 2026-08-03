cubesAI Web frontend

Files:
- `index.html` — main page
- `styles.css` — styles
- `script.js` — response engine and chat UI logic

How to run locally:

Open `index.html` directly in your browser, or run a local server for better behavior:

```bash
cd ~/ArchAI/web
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Branding and copyright:
- Do NOT use the official Arch Linux logo or wordmark without permission.
- The site uses a simple original logo placeholder (the letter "A"). Replace `logo` in `index.html` with your own original SVG or PNG.
- Add `Made by Brede` in the footer as requested.
 - The site uses an original SVG logo at `logo.svg` which is safe to use. Do NOT use the official Arch Linux logo or wordmark without permission.
 - The header currently states "inspired by the Arch Wiki" and the footer notes the project is not affiliated with Arch Linux. Avoid saying the site is "based on" the Arch Wiki to prevent implying an official relationship.

Next steps I can do for you:
- Create a simple original SVG logo for `cubesAI`.
- Add routing and a docs-style left nav to mimic wiki layout more closely.
- Package as a Progressive Web App (PWA) for installability.

Run locally with server
----------------------

This repository includes a small Flask server that serves the `web/` folder and provides a `/api/chat` endpoint backed by the `cubesAI` engine.

Quick start:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
python ../server.py
# open http://localhost:8000
```

Expose globally (examples):

- Using ngrok (quick, for development):

```bash
# install ngrok and run
ngrok http 8000
# ngrok will print a public HTTPS URL that tunnels to your local server
```

- Deploy to a VPS or cloud and run with Gunicorn:

```bash
pip install -r ../requirements.txt
gunicorn -w 4 server:app -b 0.0.0.0:8000
```

Notes:
- If you run on your machine, you must open ports and configure NAT/firewall for global access.
- Ngrok is easiest for quick public access without changing network settings.

Security and encryption
-----------------------

- This project provides plaintext HTTP by default for local testing. For any public/global deployment, always terminate TLS (HTTPS) at a reverse proxy (example: nginx) or use a platform that provides HTTPS.
- Recommended production setup:

  1. Put nginx in front of the Flask app and obtain certificates using Certbot (Let's Encrypt).
  2. Run the Flask app with Gunicorn bound to localhost and let nginx reverse-proxy the HTTPS connection.
  3. Use the `ALLOWED_ORIGINS` environment variable to restrict which origins can call the `/api/chat` endpoint.
  4. Ensure the server is behind a firewall and only exposes necessary ports.

Example nginx snippet:

```nginx
server {
	listen 80;
	server_name your.domain.tld;
	return 301 https://$host$request_uri;
}

server {
	listen 443 ssl;
	server_name your.domain.tld;

	ssl_certificate /etc/letsencrypt/live/your.domain.tld/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/your.domain.tld/privkey.pem;

	location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

The `server.py` includes security headers, a small request-size limit, and supports origin restriction and rate limiting via `Flask-Limiter`. Configure `ALLOWED_ORIGINS` and run the app behind TLS for a trustworthy, encrypted deployment.

Docker + Caddy deployment (example)
----------------------------------

This is a simple production path: run the app in Docker and use Caddy as a TLS reverse proxy that automatically provisions Let's Encrypt certificates.

1. Build the container on your server:

```bash
docker build -t cubesai:latest .
```

2. Run the container (example):

```bash
docker run -d --name cubesai -p 8000:8000 cubesai:latest
```

3. Install Caddy on the server and place the provided `Caddyfile` at `/etc/caddy/Caddyfile`, replacing `your.domain.tld` with your domain, and ensure DNS A record for `your.domain.tld` points to your server IP.

4. Start Caddy (systemd or service) — Caddy will obtain TLS certs and proxy HTTPS to the container on port 8000.

Notes:
- Ensure the container listens only on localhost in a hardened setup (use `-p 127.0.0.1:8000:8000`), and let Caddy proxy externally.
- Use `ALLOWED_ORIGINS` to restrict which sites can call `/api/chat`.

Alternative: deploy to a PaaS (Render, Fly, Railway)
--------------------------------------------------

Render is a free option that does not require payment information for basic web services. This repo includes `render.yaml` so you can deploy directly from GitHub with a free Render app.

Render deployment steps:

1. Create a free Render account at https://render.com.
2. Connect your GitHub repository to Render.
3. Create a new web service and choose the free plan.
4. Use `Docker` as the environment and `Dockerfile` as the build file.
5. Add an environment variable:

   - `ALLOWED_ORIGINS` = `https://archaiweb2026.onrender.com`

6. Deploy. Render will build the image and give you a permanent HTTPS URL like:

   `https://archaiweb2026.onrender.com`

Most PaaS providers accept a `Dockerfile` or `Procfile`. Configure the service to expose port `8000` and set the `ALLOWED_ORIGINS` environment variable to your production domain.

GitHub Actions automated deploy (optional)
-----------------------------------------

This repo includes a GitHub Actions workflow that builds and publishes a Docker image to GitHub Container Registry and can optionally SSH-deploy the image to a server.

1. Push this repository to GitHub.
2. In the repo `Settings > Secrets and variables > Actions`, add these secrets if you want automatic SSH deployment:

	- `SSH_PRIVATE_KEY`: private key used to SSH into your server (install the public key in `~/.ssh/authorized_keys` for the deploy user).
	- `DEPLOY_HOST`: server IP or hostname
	- `DEPLOY_USER`: SSH user
	- `DEPLOY_PORT`: optional SSH port (defaults to 22)

3. The workflow will push the image to `ghcr.io/<your-org-or-username>/archai:latest`. On your server, ensure Docker is installed and the deploy user can run `docker` commands.

Server preparation example (on your VPS):

```bash
# create deploy user and allow Docker usage
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# install docker
curl -fsSL https://get.docker.com | sh

# install Caddy (optional) and configure Caddyfile to reverse proxy your.domain.tld to 127.0.0.1:8000
```

4. After pushing to `main`, the workflow builds and pushes the image. If `SSH_PRIVATE_KEY` is set, the workflow connects and runs `docker run` to update the `archai` container.

Notes & safety
--------------
- Keep your `SSH_PRIVATE_KEY` secret; prefer deploying from a CI service account with limited privileges. Consider using a deploy user with only Docker permissions.
- Alternatively, deploy manually by SSH and running `docker pull ghcr.io/<you>/archai:latest && docker run -d ...`.

