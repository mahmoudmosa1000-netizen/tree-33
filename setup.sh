#!/bin/bash
# setup.sh — Tree of Knowledge: Alles in einem Befehl starten
# Ausführen: bash setup.sh

set -e

BOLD="\033[1m"
GREEN="\033[32m"
GOLD="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

echo ""
echo -e "${GOLD}${BOLD}🌳 Tree of Knowledge — Setup${RESET}"
echo -e "${GOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# ── Voraussetzungen prüfen ────────────────────────────────
check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}✗ '$1' fehlt. Bitte installieren: $2${RESET}"
    exit 1
  fi
  echo -e "${GREEN}✓ $1 gefunden${RESET}"
}

echo -e "${CYAN}${BOLD}[1/6] Voraussetzungen prüfen...${RESET}"
check_cmd "node"   "https://nodejs.org"
check_cmd "npm"    "https://nodejs.org"
check_cmd "docker" "https://docker.com"
check_cmd "git"    "https://git-scm.com"

NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}✗ Node.js >= 18 benötigt (aktuell: v${NODE_VER})${RESET}"
  exit 1
fi
echo ""

# ── .env.local erstellen ──────────────────────────────────
echo -e "${CYAN}${BOLD}[2/6] Umgebungsvariablen konfigurieren...${RESET}"

if [ ! -f ".env.local" ]; then
  cat > .env.local << 'ENVEOF'
# Automatisch von setup.sh erstellt
DATABASE_URL="postgresql://tok_user:tok_secret@localhost:5432/tree_of_knowledge"
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3"
NEXTAUTH_SECRET="tok-dev-secret-bitte-in-produktion-aendern-32ch"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENVEOF
  echo -e "${GREEN}✓ .env.local erstellt${RESET}"
else
  echo -e "${GREEN}✓ .env.local bereits vorhanden${RESET}"
fi
echo ""

# ── Docker Services starten ───────────────────────────────
echo -e "${CYAN}${BOLD}[3/6] Docker Services starten (PostgreSQL + Ollama)...${RESET}"

if [ -f "tok-deploy/docker-compose.yml" ]; then
  docker-compose -f tok-deploy/docker-compose.yml up -d postgres ollama
  echo -e "${GREEN}✓ PostgreSQL läuft auf Port 5432${RESET}"
  echo -e "${GREEN}✓ Ollama läuft auf Port 11434${RESET}"
  echo -e "${GREEN}✓ pgAdmin läuft auf http://localhost:5050${RESET}"
else
  echo -e "${GOLD}⚠ docker-compose.yml nicht gefunden — überspringe Docker${RESET}"
fi
echo ""

# ── npm install ───────────────────────────────────────────
echo -e "${CYAN}${BOLD}[4/6] Node-Abhängigkeiten installieren...${RESET}"
npm install
echo -e "${GREEN}✓ npm install abgeschlossen${RESET}"
echo ""

# ── Datenbank setup ───────────────────────────────────────
echo -e "${CYAN}${BOLD}[5/6] Datenbank einrichten...${RESET}"

echo "  Warte auf PostgreSQL..."
for i in $(seq 1 20); do
  if docker exec tok-postgres pg_isready -U tok_user -d tree_of_knowledge &>/dev/null 2>&1; then
    break
  fi
  sleep 1
  echo -n "."
done
echo ""

npx prisma generate
npx prisma db push --accept-data-loss
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
echo -e "${GREEN}✓ Datenbank mit 25 Philosophen befüllt${RESET}"
echo ""

# ── Ollama Modell laden ───────────────────────────────────
echo -e "${CYAN}${BOLD}[6/6] Ollama Modell laden (llama3 ~4GB, kann dauern)...${RESET}"
echo -e "${GOLD}  Läuft im Hintergrund. Fortschritt: docker logs -f tok-ollama${RESET}"
docker exec tok-ollama ollama pull llama3 &
OLLAMA_PID=$!
echo -e "${GREEN}✓ Ollama-Download gestartet (PID: $OLLAMA_PID)${RESET}"
echo ""

# ── Fertig ────────────────────────────────────────────────
echo -e "${GOLD}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${GREEN}${BOLD}🎉 Setup abgeschlossen!${RESET}"
echo ""
echo -e "${BOLD}Nächste Schritte:${RESET}"
echo -e "  ${CYAN}npm run dev${RESET}           → App starten (http://localhost:3000)"
echo -e "  ${CYAN}npm run db:studio${RESET}     → Prisma Studio öffnen"
echo -e "  ${CYAN}npm run db:seed${RESET}       → Daten neu laden"
echo ""
echo -e "${BOLD}Scraper (mehr Philosophen):${RESET}"
echo -e "  ${CYAN}npx ts-node scripts/scrape-wikidata.ts${RESET}"
echo ""
echo -e "${BOLD}Services:${RESET}"
echo -e "  App:      http://localhost:3000"
echo -e "  pgAdmin:  http://localhost:5050  (admin@tok.local / admin123)"
echo -e "  Ollama:   http://localhost:11434"
echo ""
echo -e "${GOLD}🌳 Baum des Wissens wächst...${RESET}"
echo ""
