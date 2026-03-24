import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UsersIcon,
  BriefcaseIcon,
  LightBulbIcon,
  GlobeAltIcon,
  TrophyIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Leaderboard from './Leaderboard';

export default function GameOver({ result, playerName, onRestart }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const isVictory = result.isVictory;

  const statConfig = {
    people: { label: 'Hòa hợp tôn giáo', icon: UsersIcon, color: '#2E7D32' },
    class: { label: 'Lòng tin tín đồ', icon: BriefcaseIcon, color: '#1976D2' },
    idea: { label: 'Giáo lý & Đối thoại', icon: LightBulbIcon, color: '#FBC02D' },
    intl: { label: 'Ổn định cộng đồng', icon: GlobeAltIcon, color: '#7B1FA2' }
  };

  const getFailureMessage = () => {
    if (result.people <= 0) {
      return {
        title: "Hòa hợp tôn giáo sụp đổ",
        message: "Mâu thuẫn giữa các tôn giáo leo thang không kiểm soát. Khi các cộng đồng không còn tin tưởng nhau, xã hội tan vỡ từ bên trong. Hòa hợp không thể xây dựng bằng áp đặt — chỉ có thể vun đắp bằng lắng nghe."
      };
    }
    if (result.class <= 0) {
      return {
        title: "Tín đồ mất niềm tin",
        message: "Người dân không còn tin vào sự công tâm của lãnh đạo. Khi lòng tin bị phá vỡ, mọi chính sách đều trở thành nghi kỵ. Niềm tin một khi mất đi, rất khó lấy lại."
      };
    }
    if (result.idea <= 0) {
      return {
        title: "Đối thoại hoàn toàn đổ vỡ",
        message: "Các tôn giáo ngừng lắng nghe nhau, mỗi bên co cụm trong giáo lý của mình. Không có đối thoại, không có hiểu biết chung — và không có hòa hợp. Sự im lặng này đắt hơn mọi xung đột."
      };
    }
    if (result.intl <= 0) {
      return {
        title: "Cộng đồng bất ổn",
        message: "Xung đột lan rộng, trật tự xã hội không còn được duy trì. Ổn định không phải là đàn áp — mà là nền tảng để tự do tín ngưỡng có thể tồn tại bền vững."
      };
    }
    return {
      title: "Sứ mệnh chưa hoàn thành",
      message: "Hòa hợp tôn giáo là hành trình dài, đòi hỏi kiên nhẫn và công tâm ở mọi quyết định."
    };
  };

  const failure = getFailureMessage();

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-panel animate-fade-in-up" style={{ maxWidth: '600px', padding: '3rem', textAlign: 'center', borderTop: isVictory ? '6px solid var(--success)' : '6px solid var(--danger)' }}>

        <div style={{ marginBottom: '2rem' }}>
          {isVictory ? (
            <CheckCircleIcon className="icon-lg" style={{ width: '5rem', height: '5rem', color: 'var(--success)', margin: '0 auto' }} />
          ) : (
            <XCircleIcon className="icon-lg" style={{ width: '5rem', height: '5rem', color: 'var(--danger)', margin: '0 auto' }} />
          )}
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem', color: isVictory ? 'var(--success)' : 'var(--danger)' }}>
            {isVictory ? "HÒA HỢP THÀNH CÔNG!" : "SỨ MỆNH CHƯA HOÀN THÀNH"}
          </h2>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', opacity: 0.8 }}>
            {isVictory ? "Tôn trọng — Lắng nghe — Đồng hành" : failure.title.toUpperCase()}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {Object.entries(statConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon className="icon-sm" style={{ color: config.color }} />
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{config.label}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{result[key]}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span>Tổng số lượt:</span>
            <span style={{ fontWeight: 'bold' }}>{result.turns} / 30</span>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2.5rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          {isVictory
            ? "Bạn đã dẫn dắt cộng đồng vượt qua 30 thử thách mà không để tôn giáo nào bị bỏ lại phía sau. Đây là minh chứng rằng hòa hợp không phải là điều không tưởng — mà là lựa chọn được thực hiện mỗi ngày."
            : failure.message}
        </p>

        <button
          onClick={onRestart}
          style={{
            background: isVictory ? 'var(--success)' : 'var(--text-main)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1.1rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease',
            marginRight: '1rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowPathIcon className="icon-sm" />
          Bắt đầu lại hành trình
        </button>

        <button
          onClick={() => setShowLeaderboard(true)}
          style={{
            background: 'var(--accent-gold)',
            color: '#333',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1.1rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <TrophyIcon className="icon-sm" />
          Bảng xếp hạng
        </button>
      </div>

      <AnimatePresence>
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </AnimatePresence>
    </div>
  );
}
