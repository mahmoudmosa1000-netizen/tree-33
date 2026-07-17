# 🌳 Tree of Knowledge — Hosting Guide

Die `index.html` ist **komplett selbstständig** (66 KB).  
Keine Build-Pipeline. Kein npm. Kein Server. Einfach hochladen.

---

## ⚡ Schnellstart (2 Minuten)

### Option 1 — Netlify Drop (Einfachste Methode)
1. [netlify.com/drop](https://netlify.com/drop) öffnen
2. `index.html` in das Browser-Fenster **ziehen**
3. Fertig! URL erscheint sofort (z.B. `rainbow-unicorn-123.netlify.app`)
4. Optionaler Custom-Domain in den Netlify-Einstellungen

```
Kosten: kostenlos
Zeit:   ~60 Sekunden
```

---

### Option 2 — GitHub Pages

```bash
# Neues GitHub Repo anlegen
gh repo create tree-of-knowledge --public

# Dateien hochladen
cp tok-hosting/index.html .
cp tok-hosting/.github/workflows/pages.yml .github/workflows/
git add . && git commit -m "🌳 Tree of Knowledge"
git push
```

Dann: **Repository → Settings → Pages → Source: GitHub Actions**

Bei jedem Push auf `main` deployed automatisch!

```
URL:    https://DEIN-NAME.github.io/tree-of-knowledge
Kosten: kostenlos
Zeit:   ~2 Minuten
```

---

### Option 3 — Cloudflare Pages (Schnellste CDN)

```bash
# Cloudflare Pages CLI
npm i -g wrangler
wrangler pages deploy tok-hosting/ --project-name=tree-of-knowledge
```

Oder: [pages.cloudflare.com](https://pages.cloudflare.com) → Upload-Ordner → fertig.

```
URL:    https://tree-of-knowledge.pages.dev
Kosten: kostenlos (unbegrenzte Bandbreite!)
CDN:    300+ Standorte weltweit
Zeit:   ~3 Minuten
```

---

### Option 4 — Eigener Server (Nginx)

```bash
# Auf dem Server:
sudo mkdir -p /var/www/tree-of-knowledge
sudo cp index.html /var/www/tree-of-knowledge/

# Nginx konfigurieren
sudo cp nginx.conf /etc/nginx/sites-available/tree-of-knowledge
sudo ln -s /etc/nginx/sites-available/tree-of-knowledge /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS mit Let's Encrypt
sudo certbot --nginx -d deine-domain.de
```

```
Kosten: Hetzner CX11 ~€4/Monat
```

---

### Option 5 — Jede beliebige Plattform

Die HTML läuft auch auf:
- **Vercel**: `vercel deploy --static`
- **AWS S3 + CloudFront**: S3-Bucket mit Static Website Hosting
- **Firebase Hosting**: `firebase deploy`
- **Surge.sh**: `surge index.html`
- **Render**: Static Site, Root-Dir = `tok-hosting/`
- **IONOS / Strato / 1&1**: Per FTP hochladen ✓
- **USB-Stick / lokaler PC**: Einfach doppelklicken ✓

---

## 🔗 Teilbare Links

Dank Hash-Routing kann jeder Philosoph direkt verlinkt werden:

```
https://deine-domain.de/#philosopher=nietzsche
https://deine-domain.de/#philosopher=kant&view=galaxy
https://deine-domain.de/#philosopher=arendt&view=mindmap
```

Der 🔗-Button in der Sidebar kopiert den Link automatisch.

---

## ⬇ Offline-Nutzung

Der **⬇-Button** im Header speichert die HTML-Datei lokal.  
Danach funktioniert alles offline — außer:
- Wikipedia-Portraits (braucht Internet)
- Ollama KI-Chat (braucht lokale Ollama-Instanz)

---

## 🦙 Ollama auf gehosteter Seite nutzen

Das Gerät des Nutzers muss Ollama lokal laufen haben:

```bash
# Nutzer startet lokal:
OLLAMA_ORIGINS="https://deine-domain.de" ollama serve
```

Oder du betreibst einen eigenen Ollama-Server und trägst die URL  
per ⚙-Button in der App ein.

---

## 📊 Vergleich

| Plattform       | Preis       | Setup   | CDN | Custom Domain |
|----------------|-------------|---------|-----|---------------|
| Netlify Drop   | Kostenlos   | 1 Min   | ✓   | ✓ (kostenlos) |
| GitHub Pages   | Kostenlos   | 2 Min   | ✓   | ✓ (kostenlos) |
| Cloudflare     | Kostenlos   | 3 Min   | ✓✓✓ | ✓ (kostenlos) |
| Eigener Server | ~€4/Monat   | 15 Min  | –   | ✓             |
| Vercel         | Kostenlos   | 2 Min   | ✓   | ✓ (kostenlos) |
| FTP-Hoster     | ~€2/Monat   | 5 Min   | –   | ✓             |