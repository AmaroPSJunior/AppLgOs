import { Octokit } from "octokit";
import { readFileSync, existsSync } from "fs";
import "dotenv/config";

async function forceSync() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  if (!token || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const octokit = new Octokit({ auth: token });

  const filesToSync = [
    "index.html",
    "main.js",
    "appinfo.json",
    "package.json",
    "icon.png",
    ".github/workflows/package.yml"
  ];

  for (const path of filesToSync) {
    if (!existsSync(path)) continue;
    try {
      let sha: string | undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {}

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Deployment: webOS Luna Dashboard v1.3`,
        content: readFileSync(path).toString("base64"),
        sha
      });
      console.log(`✅ ${path} sincronizado.`);
    } catch (e: any) {
      console.error(`❌ Erro em ${path}: ${e.message}`);
    }
  }
}
forceSync();
