# 🌳 Tree of Knowledge — Deployment Guide

Vollständige Anleitung: von 0 bis live auf Vercel + Supabase in ~30 Minuten.

---

## Option A — Lokal (Entwicklung)

### Voraussetzungen
- Node.js ≥ 18
- Docker Desktop
- Git

### 1 Befehl
```bash
bash tok-deploy/setup.sh
```

Das Skript erledigt automatisch:
1. Voraussetzungen prüfen
2. `.env.local` anlegen
3. PostgreSQL + Ollama via Docker starten
4. `npm install` + Prisma generieren
5. Datenbank befüllen (25 Philosophen)
6. Ollama-Modell laden (`llama3`, ~4 GB)

Danach:
```bash
npm run dev
# → http://localhost:3000
```

---

## Option B — Vercel + Supabase (Produktion)

### Schritt 1 — Supabase

1. [supabase.com](https://supabase.com) → Neues Projekt anlegen
2. **Settings → Database → Connection string** kopieren
3. Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

### Schritt 2 — GitHub

```bash
git init
git add .
git commit -m "🌳 Initial Tree of Knowledge"
gh repo create tree-of-knowledge --public --push
```

### Schritt 3 — Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Vercel fragt nach Umgebungsvariablen. Alle aus `.env.example` eingeben.

**Oder:** Vercel-Dashboard → Settings → Environment Variables:

| Variable | Wert |
|---|---|
| `DATABASE_URL` | Supabase Connection String |
| `OLLAMA_URL` | `https://dein-ollama-server.de` oder leer |
| `OLLAMA_MODEL` | `llama3` |
| `NEXTAUTH_SECRET` | Zufälliger 32-Zeichen String |
| `NEXTAUTH_URL` | `https://deine-domain.vercel.app` |

### Schritt 4 — Datenbank befüllen

```bash
# Einmalig nach erstem Deploy:
DATABASE_URL="supabase-url" npx prisma migrate deploy
DATABASE_URL="supabase-url" npx ts-node prisma/seed.ts
```

### Schritt 5 — CI/CD aktivieren

GitHub Actions Secrets setzen (Repository → Settings → Secrets):
```
VERCEL_TOKEN       → vercel.com/account/tokens
VERCEL_ORG_ID      → vercel.com/account → vercel.json
DATABASE_URL       → Supabase URL
NEXTAUTH_SECRET    → Zufalls-String
NEXTAUTH_URL       → https://deine-app.vercel.app
```

Ab jetzt deployed jeder Push auf `main` automatisch! ✅

---

## Option C — Ollama auf eigenem Server

Für echte KI-Antworten im Produktionsbetrieb braucht man einen eigenen Ollama-Server.

### Hetzner Cloud (empfohlen, ~€20/Monat)

```bash
# Hetzner Cloud → Neuer Server → Ubuntu 22.04, CPX31 (4 vCPU, 8 GB RAM)

# SSH in den Server
ssh root@SERVER_IP

# Ollama installieren
curl -fsSL https://ollama.ai/install.sh | sh

# Systemd-Service mit CORS
cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"

[Install]
WantedBy=multi-user.target
EOF

systemctl enable --now ollama

# Modell laden
ollama pull llama3

# Nginx als HTTPS-Proxy
apt install nginx certbot python3-certbot-nginx -y
certbot --nginx -d ollama.deine-domain.de
```

Dann `OLLAMA_URL=https://ollama.deine-domain.de` in Vercel setzen.

---

## Philosophen-Scraper

### Automatisch (GitHub Actions)

Der Scraper läuft jeden Montag automatisch. Manuell auslösen:
```
GitHub → Actions → "Wikidata Scraper" → Run workflow
```

### Lokal ausführen

```bash
# Alle Philosophen von Wikidata laden (80–150 neue)
npx ts-node scripts/scrape-wikidata.ts

# Einfluss-Netzwerk aktualisieren
npx ts-node scripts/detect-influences.ts
```

### Fortschritt verfolgen

```bash
# Wie viele Philosophen in der DB?
npx prisma studio
# → http://localhost:5555
```

---

## Nützliche Befehle

```bash
# Entwicklung
npm run dev              # Dev-Server
npm run build            # Produktions-Build
npm run lint             # Code-Qualität

# Datenbank
npm run db:push          # Schema pushen (dev)
npm run db:seed          # Seed-Daten laden
npm run db:studio        # Prisma Studio öffnen
npm run db:generate      # Prisma Client generieren

# Scraper
npx ts-node scripts/scrape-wikidata.ts
npx ts-node scripts/detect-influences.ts

# Docker
docker-compose -f tok-deploy/docker-compose.yml up -d
docker-compose -f tok-deploy/docker-compose.yml down
docker logs -f tok-ollama   # Ollama-Logs

# Vercel
vercel --prod              # Deploy
vercel logs                # Live-Logs
vercel env pull            # Env-Vars lokal ziehen
```

---

## Architektur-Übersicht

```
Browser
  │
  ├── tree-of-knowledge.html   ← Standalone (Prototyp, keine DB nötig)
  │
  └── Next.js App (Produktion)
        │
        ├── /api/philosophers  ← Prisma → PostgreSQL (Supabase)
        ├── /api/ai            ← Proxy → Ollama (Server oder lokal)
        │
        ├── PostgreSQL         ← Wikidata-Scraper befüllt automatisch
        └── Ollama             ← llama3 / mistral / phi4 lokal
```

---

## Kosten (Produktion)

| Service | Plan | Kosten |
|---|---|---|
| Vercel | Hobby | **kostenlos** |
| Supabase | Free | **kostenlos** (500 MB) |
| Supabase | Pro | $25/Monat (8 GB) |
| Ollama | Lokal | **kostenlos** |
| Ollama | Hetzner CPX31 | ~€20/Monat |
| Domain | Cloudflare | ~€10/Jahr |
| **Gesamt minimal** | | **~€0** |
| **Gesamt vollständig** | | **~€35/Monat** |

---

## Support & Erweiterungen

Nächste Entwicklungsschritte in `ROADMAP.md`.

Bugs & Feature-Requests: GitHub Issues.
