/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { 
  Monitor, Cpu, Github, Tv, Terminal, Info, 
  Layout, Play, CheckCircle2, Moon, Sun 
} from "lucide-react";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  // Toggle dark mode class on document body for global consistency
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 flex flex-col font-sans p-4 md:p-8 overflow-x-hidden">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <span className="font-bold text-xl">wO</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">webOS Developer Workspace</h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider uppercase">Project: Basic Welcome App</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-yellow-400 cursor-pointer"
            aria-label="Alternar Modo Escuro"
          >
            <div className={`transform ${isDark ? 'rotate-0' : '-rotate-90'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">TV Connection: Active</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-mono">v1.0</div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Left Column: Manifest & Workflow */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6 order-2 lg:order-1">
          <div 
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-600">ⓘ</span>
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">App Manifest (appinfo.json)</h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed overflow-hidden border border-transparent dark:border-slate-800">
              <span className="text-blue-600 dark:text-blue-400">"id":</span> "com.myapp.webos",<br/>
              <span className="text-blue-600 dark:text-blue-400">"version":</span> "1.0.0",<br/>
              <span className="text-blue-600 dark:text-blue-400">"type":</span> "web",<br/>
              <span className="text-blue-600 dark:text-blue-400">"main":</span> "index.html",<br/>
              <span className="text-blue-600 dark:text-blue-400">"title":</span> "Welcome App"
            </div>
          </div>

          <div 
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-900 dark:text-slate-200 tracking-tighter font-bold">Git</span>
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Deployment Pipeline</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-600 rounded-full border-t-blue-500"></div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Packing .ipk</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">package.yml: line 38</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-blue-500"></div>
            </div>
          </div>
        </div>

        {/* Center Column: Screen Preview */}
        <div className="w-full lg:w-1/2 flex flex-col order-1 lg:order-2">
          <div 
            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border-8 border-slate-900 dark:border-slate-800 shadow-2xl relative flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="absolute top-6 left-8 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700">TV Screen Preview</div>
            
            <div className="text-center space-y-4 px-6">
              <h2 
                className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight"
              >
                Bem-vindo Amaro!
              </h2>
              <p className="text-slate-400 dark:text-slate-500 font-medium md:text-lg">webOS TV Deployment Ready</p>
            </div>
            
            <div className="absolute bottom-8 flex gap-3">
              <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
          </div>

          <footer className="mt-6 flex flex-wrap justify-center gap-6 lg:gap-12 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Sair</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Menu</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Opções</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Ajuda</div>
          </footer>
        </div>

        {/* Right Column: Instructions */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6 order-3">
          <div 
            className="bg-slate-900 dark:bg-black p-6 rounded-3xl text-white shadow-xl shadow-slate-200 dark:shadow-none flex-1 border border-transparent dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <span className="text-xl font-mono text-blue-500">&gt;</span>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Manual Installation</h3>
            </div>
            <ul className="space-y-6">
              {[
                { step: "01", title: "Dev Mode", text: "Instale o app 'Developer Mode' na Content Store e faça login." },
                { step: "02", title: "Package", text: "Baixe o arquivo .ipk do GitHub no navegador da TV." },
                { step: "03", title: "USB Hook", text: "Copie o app para a pasta /developer/apps/ no pendrive." },
                { step: "04", title: "CLI", text: "Use o comando ares-install para transferir via rede." }
              ].map((item, idx) => (
                <li 
                  key={idx}
                  className="flex gap-4"
                >
                  <span className="text-slate-500 dark:text-slate-600 font-mono text-sm">{item.step}</span>
                  <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-400">
                    <strong className="text-white">{item.title}:</strong> {item.text}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white/5 dark:bg-white/[0.02] rounded-xl border border-white/10 dark:border-white/5">
              <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center italic">Consulte a documentação LG para depuração via emulador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
