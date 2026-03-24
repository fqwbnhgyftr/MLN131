import { useState } from 'react';
import { UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function NameInput({ onStart }) {
  const [name, setName] = useState('');

  const startGame = () => {
    if (name.trim().length < 2) {
      alert("Vui lòng nhập tên hợp lệ"); // Keep simple alert or make custom later
      return;
    }
    onStart(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') startGame();
  };

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-panel animate-fade-in-up" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem', letterSpacing: '0.25rem' }}>
          🕊️ ✝️ ☸️ 🌙
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary-red)' }}>HÒA HỢP</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', fontFamily: 'var(--font-display)' }}>
          Hành trình kiến tạo hòa hợp tôn giáo
        </p>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-red)' }}>
            <UserIcon className="icon-md" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tên nhà lãnh đạo..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.5rem',
              fontSize: '1.1rem',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
            className="input-focus-effect"
          />
        </div>

        <button
          onClick={startGame}
          style={{
            background: 'var(--primary-red)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1.1rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(200, 16, 46, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Bắt đầu hành trình
          <ArrowRightIcon className="icon-sm" />
        </button>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', opacity: 0.7 }}>
          *Trò chơi mô phỏng về quản lý hòa hợp tôn giáo tại Việt Nam
        </p>
      </div>
    </div>
  );
}
