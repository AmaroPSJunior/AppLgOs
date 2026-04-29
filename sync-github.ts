import { Octokit } from "octokit";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { glob } from "glob";
import "dotenv/config";

async function syncToGithub() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;

  if (!token || !repoFull) {
    console.error("ERRO: GITHUB_TOKEN ou GITHUB_REPO não configurados no .env");
    process.exit(1);
  }

  const [owner, repo] = repoFull.split("/");
  const octokit = new Octokit({ auth: token });

  console.log(`🚀 Iniciando sincronia para ${owner}/${repo}...`);

  try {
    // 1. Obter a referência do branch principal (main por padrão)
    let baseTreeSha: string | undefined;
    let latestCommitSha: string | undefined;

    try {
      const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: "heads/main",
      });
      latestCommitSha = refData.object.sha;
      const { data: commitData } = await octokit.rest.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha,
      });
      baseTreeSha = commitData.tree.sha;
    } catch (e) {
      console.log("Branch 'main' não encontrado. Criando repositório inicial...");
    }

    // 2. Coletar arquivos (ignorando node_modules, dist, .git)
    const files = await glob("**/*", {
      ignore: ["node_modules/**", "dist/**", ".git/**"],
      nodir: true,
    });

    const blobs = await Promise.all(
      files.map(async (file) => {
        const content = readFileSync(file);
        const { data: blobData } = await octokit.rest.git.createBlob({
          owner,
          repo,
          content: content.toString("base64"),
          encoding: "base64",
        });
        return {
          path: file.replace(/\\/g, "/"), // Compatibilidade Windows/Unix
          mode: "100644" as const,
          type: "blob" as const,
          sha: blobData.sha,
        };
      })
    );

    // 3. Criar nova árvore
    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: blobs,
    });

    // 4. Criar o commit
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Sync via webOS App Workspace - ${new Date().toLocaleString()}`,
      tree: treeData.sha,
      parents: latestCommitSha ? [latestCommitSha] : [],
    });

    // 5. Atualizar ou criar a referência
    if (latestCommitSha) {
      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: "heads/main",
        sha: newCommitData.sha,
      });
    } else {
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: "refs/heads/main",
        sha: newCommitData.sha,
      });
    }

    console.log("✅ Sincronia concluída com sucesso!");
  } catch (error: any) {
    console.error("❌ Falha na sincronia:", error.message);
    if (error.response) console.error(error.response.data);
  }
}

syncToGithub();
