// Baut dist/: kopiert src/ und schreibt version.json mit Commit und Build-Zeit.
import { cp, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp("src", "dist", { recursive: true });

const version = {
  commit: process.env.GITHUB_SHA ?? "lokal",
  builtAt: new Date().toISOString(),
};
await writeFile(
  "dist/public/version.json",
  `${JSON.stringify(version, null, 2)}\n`,
);
console.log("dist/ gebaut:", version);
