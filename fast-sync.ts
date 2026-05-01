import { Octokit } from "octokit";
import { readFileSync } from "fs";
import "dotenv/config";

async function fastSync() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  if (!token || !repoFull) return;
  const [owner, repo] = repoFull.split("/");
  const octokit = new Octokit({ auth: token });

  async function upload(path: string) {
    try {
      let sha: string | undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {}

      await octokit.rest.repos.createOrUpdateFileContents({
        owner, repo, path,
        message: `Fast sync: ${path}`,
        content: readFileSync(path).toString("base64"),
        sha
      });
      console.log(`✅ ${path} enviado.`);
    } catch (e: any) {
      console.error(`❌ Erro em ${path}: ${e.message}`);
    }
  }

  await upload("appinfo.json");
  await upload("vite.config.ts");
}
fastSync();
