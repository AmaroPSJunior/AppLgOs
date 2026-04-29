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

    // 2. Coletar arquivos e enviar um por um (mais lento mas mais robusto para este ambiente)
    const files = await glob("**/*", {
      ignore: ["node_modules/**", "dist/**", ".git/**", ".env", "package-lock.json"],
      nodir: true,
      dot: true
    });

    console.log(`📦 Enviando ${files.length} arquivos...`);

    for (const file of files) {
      const path = file.replace(/\\/g, "/");
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
          message: `Sync: ${path}`,
          content: readFileSync(file).toString("base64"),
          sha
        });
        console.log(`  ✅ ${path}`);
      } catch (e: any) {
        console.error(`  ❌ Erro em ${path}: ${e.message}`);
      }
    }

    console.log("✅ Sincronia concluída!");
  } catch (error: any) {
    console.error("❌ Falha na sincronia:", error.message);
  }
}

syncToGithub();
