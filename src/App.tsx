/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <span className="font-bold text-xl">wO</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight transition-colors">webOS Developer Workspace</h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wider uppercase">Project: Basic Welcome App</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-yellow-400 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Alternar Modo Escuro"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">TV Connection: Active</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-mono transition-colors">v1.0</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Manifest & Workflow */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">App Manifest (appinfo.json)</h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed overflow-hidden transition-colors border border-transparent dark:border-slate-800">
              <span className="text-blue-600 dark:text-blue-400">"id":</span> "com.myapp.webos",<br/>
              <span className="text-blue-600 dark:text-blue-400">"version":</span> "1.0.0",<br/>
              <span className="text-blue-600 dark:text-blue-400">"type":</span> "web",<br/>
              <span className="text-blue-600 dark:text-blue-400">"main":</span> "index.html",<br/>
              <span className="text-blue-600 dark:text-blue-400">"title":</span> "Welcome App"
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-4 h-4 text-slate-900 dark:text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Deployment Pipeline</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-600 rounded-full border-t-blue-500 animate-spin"></div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Packing .ipk</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">package.yml: line 38</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden transition-colors">
              <div className="w-3/4 h-full bg-blue-500"></div>
            </div>
          </motion.div>
        </div>

        {/* Center Column: Screen Preview */}
        <div className="lg:col-span-6 flex flex-col order-1 lg:order-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border-8 border-slate-900 dark:border-slate-800 shadow-2xl relative flex flex-col items-center justify-center min-h-[400px] transition-all"
          >
            <div className="absolute top-6 left-8 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-colors">TV Screen Preview</div>
            
            <div className="text-center space-y-4 px-6">
              <motion.h2 
                key={isDark ? "dark-title" : "light-title"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors"
              >
                Bem-vindo ao nosso app!
              </motion.h2>
              <p className="text-slate-400 dark:text-slate-500 font-medium md:text-lg transition-colors">webOS TV Deployment Ready</p>
            </div>
            
            <div className="absolute bottom-8 flex gap-3">
              <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors"></div>
            </div>
          </motion.div>

          <footer className="mt-6 flex flex-wrap justify-center gap-6 lg:gap-12 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <div className="flex items-center gap-2 transition-colors"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-200 dark:shadow-red-900/20"></div> Sair</div>
            <div className="flex items-center gap-2 transition-colors"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200 dark:shadow-green-900/20"></div> Menu</div>
            <div className="flex items-center gap-2 transition-colors"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200 dark:shadow-yellow-900/20"></div> Opções</div>
            <div className="flex items-center gap-2 transition-colors"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200 dark:shadow-blue-900/20"></div> Ajuda</div>
          </footer>
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 dark:bg-black p-6 rounded-3xl text-white shadow-xl shadow-slate-200 dark:shadow-none flex-1 transition-colors border border-transparent dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <Terminal className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">Manual Installation</h3>
            </div>
            <ul className="space-y-6">
              {[
                { step: "01", title: "Dev Mode", text: "Instale o app 'Developer Mode' na Content Store e faça login." },
                { step: "02", title: "Package", text: "Baixe o arquivo .ipk do GitHub no navegador da TV." },
                { step: "03", title: "USB Hook", text: "Copie o app para a pasta /developer/apps/ no pendrive." },
                { step: "04", title: "CLI", text: "Use o comando ares-install para transferir via rede." }
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="text-slate-500 dark:text-slate-600 font-mono text-sm">{item.step}</span>
                  <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-400 transition-colors">
                    <strong className="text-white">{item.title}:</strong> {item.text}
                  </p>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white/5 dark:bg-white/[0.02] rounded-xl border border-white/10 dark:border-white/5 transition-colors">
              <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center italic transition-colors">Consulte a documentação LG para depuração via emulador.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
