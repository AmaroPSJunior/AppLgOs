import { useState, useEffect } from "react";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="container">
      <div className="header">
        <div className="header-inner">
          <h1 className="title">webOS Workspace</h1>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px' }}>
            PROJECT: LEGACY COMPATIBILITY MODE (CHROME 38)
          </p>
          <button 
            onClick={() => setIsDark(!isDark)}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isDark ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </div>

      <div className="main-content">
        <h2 className="welcome-text">Bem-vindo ao nosso app!</h2>
        <p style={{ color: '#64748b' }}>webOS TV Deployment Ready (v1.0.1)</p>
        
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', color: '#334155', fontSize: '14px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Status do Sistema:</strong> 
            Conectado via rede de desenvolvedor. 
            <br/> Pronto para instalação em TVs de 2014 a 2024.
        </div>
      </div>

      <div className="footer-tags">
        <div className="tag"><span className="dot red"></span> Sair</div>
        <div className="tag"><span className="dot green"></span> Menu</div>
        <div className="tag"><span className="dot yellow"></span> Opções</div>
        <div className="tag"><span className="dot blue"></span> Ajuda</div>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
        Aplicativo otimizado para compatibilidade máxima com processadores antigos (ES5 / No-Vars).
      </div>
    </div>
  );
}
