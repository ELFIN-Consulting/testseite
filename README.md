# testseite

Übungsprojekt für den Deploy-Weg: eigener Rechner → GitHub → Hetzner-Server (`188.245.13.25`).

## Lokal

```bash
npm ci
npm run lint && npm run format:check && npm test
npm run build && npm start   # http://127.0.0.1:3000
```

## Deploy

Jeder Push auf `main` startet `.github/workflows/deploy.yml`. Zuerst laufen die Prüfungen
(Lint, Prettier, Audit, Tests, Build), danach landet `dist/` auf dem Server unter
`/srv/testseite/releases/<commit>`. Dort stellt `activate-testseite` auf das neue Release um,
startet den Dienst neu und prüft `/health`. Schlägt die Prüfung fehl, geht es automatisch
zurück auf das vorherige Release.

Ein erneuter Deploy ohne Commit: GitHub → Actions → CI & Deploy → Run workflow.
