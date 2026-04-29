/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from "motion/react";
import { Monitor, Cpu, Github, Tv, Terminal, Info, Layout, Play, CheckCircle2 } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans p-4 md:p-8 overflow-x-hidden">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="font-bold text-xl">wO</span>
          </div>
          <div>
            <h1 className="text-slate-900 font-bold text-lg leading-tight">webOS Developer Workspace</h1>
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Project: Basic Welcome App</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">TV Connection: Active</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-mono">v1.0</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Manifest & Workflow */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-600" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">App Manifest (appinfo.json)</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-[11px] text-slate-700 leading-relaxed overflow-hidden">
              <span className="text-blue-600">"id":</span> "com.myapp.webos",<br/>
              <span className="text-blue-600">"version":</span> "1.0.0",<br/>
              <span className="text-blue-600">"type":</span> "web",<br/>
              <span className="text-blue-600">"main":</span> "index.html",<br/>
              <span className="text-blue-600">"title":</span> "Welcome App"
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-4 h-4 text-slate-900" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment Pipeline</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-full border-t-blue-500 animate-spin"></div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Packing .ipk</p>
                <p className="text-[10px] text-slate-400 font-medium">package.yml: line 38</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-blue-500"></div>
            </div>
          </motion.div>
        </div>

        {/* Center Column: Screen Preview */}
        <div className="lg:col-span-6 flex flex-col order-1 lg:order-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-white rounded-3xl border-8 border-slate-900 shadow-2xl relative flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="absolute top-6 left-8 bg-slate-100 px-3 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200">TV Screen Preview</div>
            
            <div className="text-center space-y-4 px-6">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight"
              >
                Bem-vindo ao nosso app!
              </motion.h2>
              <p className="text-slate-400 font-medium md:text-lg">webOS TV Deployment Ready</p>
            </div>
            
            <div className="absolute bottom-8 flex gap-3">
              <div className="w-24 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </motion.div>

          <footer className="mt-6 flex flex-wrap justify-center gap-6 lg:gap-12 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></div> Sair</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></div> Menu</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200"></div> Opções</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div> Ajuda</div>
          </footer>
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 flex-1"
          >
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <Terminal className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Manual Installation</h3>
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
                  <span className="text-slate-500 font-mono text-sm">{item.step}</span>
                  <p className="text-xs leading-relaxed text-slate-300">
                    <strong className="text-white">{item.title}:</strong> {item.text}
                  </p>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] text-slate-400 text-center italic">Consulte a documentação LG para depuração via emulador.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
