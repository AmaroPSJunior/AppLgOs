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
    // Validar repositório e permissões
    try {
      const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo });
      console.log(`📡 Repositório verificado: ${repoInfo.full_name} (${repoInfo.private ? "privado" : "público"})`);
    } catch (e: any) {
      console.error(`❌ Erro ao acessar repositório ${owner}/${repo}: ${e.message}`);
      process.exit(1);
    }

    // 1. Obter a referência do branch principal
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

    // 2. Coletar arquivos
    const files = await glob("**/*", {
      ignore: ["node_modules/**", "dist/**", ".git/**", ".env", "package-lock.json", ".github/**"],
      nodir: true,
      dot: true
    });

    // 2. Criar Blobs para todos os arquivos em paralelo
    console.log(`📦 Criando blobs para ${files.length} arquivos...`);
    const blobs = await Promise.all(
      files.map(async (file) => {
        const path = file.replace(/\\/g, "/");
        const content = readFileSync(file);
        try {
          const { data: blobData } = await octokit.rest.git.createBlob({
            owner,
            repo,
            content: content.toString("base64"),
            encoding: "base64",
          });
          return {
            path,
            mode: "100644" as const,
            type: "blob" as const,
            sha: blobData.sha,
          };
        } catch (e: any) {
          console.error(`  ⚠️ Erro ao criar blob para ${path}: ${e.message}`);
          return null;
        }
      })
    );

    const validBlobs = blobs.filter((b): b is NonNullable<typeof b> => b !== null);

    // 3. Criar nova árvore (Tree)
    console.log("🌳 Criando árvore de arquivos...");
    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: validBlobs,
    });

    // 4. Criar o commit único
    console.log("📝 Criando commit único...");
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Sync via webOS Workspace - ${new Date().toLocaleString()}`,
      tree: treeData.sha,
      parents: latestCommitSha ? [latestCommitSha] : [],
    });

    // 5. Atualizar a referência do branch
    console.log("🚀 Atualizando branch main...");
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

    console.log("✅ Sincronia concluída com um único commit!");
  } catch (error: any) {
    console.error("❌ Falha na sincronia:", error.message);
    if (error.response) console.error(JSON.stringify(error.response.data, null, 2));
  }
}

syncToGithub();
