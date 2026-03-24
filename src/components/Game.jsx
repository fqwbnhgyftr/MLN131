import { useState, useRef, useEffect } from "react";
import { regularCards, turnBasedEvents, thresholdEvents } from "../data/cards";
import {
  UsersIcon,
  BriefcaseIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/solid';
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

const clamp = (v) => Math.max(0, Math.min(100, v));

// Stats Config with educational descriptions - Unity & Solidarity focused
const statConfig = {
  people: {
    label: 'Hòa hợp tôn giáo',
    icon: UsersIcon,
    color: '#C0392B',          // đỏ trầm — màu Phật giáo/Công giáo
    desc: 'Mức độ chung sống hòa bình giữa Phật, Công giáo, Tin lành, Cao Đài, Hòa Hảo...'
  },
  class: {
    label: 'Lòng tin tín đồ',
    icon: HandThumbUpIcon,
    color: '#1565C0',          // xanh dương — tượng trưng niềm tin
    desc: 'Tín đồ các tôn giáo tin tưởng vào sự công tâm của chính quyền địa phương'
  },
  idea: {
    label: 'Giáo lý & Đối thoại',
    icon: LightBulbIcon,
    color: '#F57F17',          // vàng — ánh sáng giác ngộ
    desc: 'Khả năng các tôn giáo đối thoại, tìm điểm chung trong giáo lý và thực hành'
  },
  intl: {
    label: 'Ổn định cộng đồng',
    icon: GlobeAltIcon,
    color: '#4A235A',          // tím — màu tâm linh
    desc: 'Mức độ ổn định trong quan hệ liên tôn giáo, tránh xung đột lan rộng'
  }
};

const getChangeColor = (value) => {
  if (value > 0) return 'var(--success)';
  if (value < 0) return 'var(--danger)';
  return 'var(--text-muted)';
};

const formatChange = (value) => {
  if (value > 0) return `+${value}`;
  return value;
};

// Achievement Definitions
const achievementDefs = [
  {
    id: 'great_harmony',
    name: 'Đại hòa hợp',
    desc: 'Giữ tất cả chỉ số trên 60 đến lượt 15',
    icon: '🕊️'
    // Cách đạt: Không thiên vị bất kỳ tôn giáo nào trong 15 lượt đầu,
    // cân bằng các quyết định giữa Phật giáo, Công giáo và các phái khác.
  },
  {
    id: 'shepherd',
    name: 'Người chăn dắt nhân từ',
    desc: 'Lòng tin tín đồ (class) đạt 80+ ở lượt 20',
    icon: '✝️'
    // Cách đạt: Ưu tiên các lựa chọn bảo vệ quyền thực hành tín ngưỡng,
    // tránh các quyết định gây cảm giác kỳ thị hoặc áp đặt.
  },
  {
    id: 'dharma_keeper',
    name: 'Hộ Pháp',
    desc: 'Giáo lý & Đối thoại (idea) đạt 75+ ở lượt 18',
    icon: '🪷'
    // Cách đạt: Đồng ý với các sự kiện thúc đẩy hội thảo liên tôn,
    // ủng hộ không gian đối thoại giữa các lãnh đạo tôn giáo.
  },
  {
    id: 'unity_bridge',
    name: 'Cầu nối liên tôn',
    desc: 'Ổn định cộng đồng (intl) đạt 70+ ở lượt 22',
    icon: '🌉'
    // Cách đạt: Giải quyết ổn thỏa các xung đột đất đai/lễ hội,
    // tránh để sự kiện ngưỡng leo thang thành bạo lực.
  },
  {
    id: 'balanced_faith',
    name: 'Cân bằng đức tin',
    desc: 'Tất cả chỉ số trong khoảng 15 điểm nhau ở lượt 20',
    icon: '⚖️'
    // Cách đạt: Không đánh đổi cực đoan — ví dụ không hy sinh
    // "Lòng tin tín đồ" để đổi lấy "Ổn định cộng đồng" quá nhiều.
  },
  {
    id: 'survivor',
    name: 'Vượt thử thách lịch sử',
    desc: 'Dẫn dắt cộng đồng qua 30 lượt biến cố',
    icon: '🏆'
    // Cách đạt: Đơn giản là sống sót — không để bất kỳ chỉ số nào về 0.
  },
  {
    id: 'steadfast_faith',
    name: 'Đức tin bền vững',
    desc: 'Không chỉ số nào xuống dưới 20 đến lượt 25',
    icon: '🛡️'
    // Cách đạt: Ưu tiên các lựa chọn "phòng thủ" — ngăn suy giảm
    // hơn là đánh cược để tăng cao một chỉ số duy nhất.
  },
  {
    id: 'enlightened',
    name: 'Giác ngộ',
    desc: 'Giáo lý & Đối thoại (idea) đạt 85+ ở lượt 15',
    icon: '☸️'
    // Cách đạt: Trong 15 lượt đầu, liên tục chọn các lựa chọn
    // tăng idea — thường là những lựa chọn ủng hộ giáo dục tâm linh,
    // hội thảo liên tôn, xuất bản kinh sách chung.
  }
];

// Extracted Card Component to ensure fresh motion state for every card
function DraggableCard({ card, onChoice }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacityYes = useTransform(x, [50, 150], [0, 1]);
  const opacityNo = useTransform(x, [-50, -150], [0, 1]);

  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(255, 0, 0, 0.05)", "rgba(255, 255, 255, 0.85)", "rgba(0, 255, 0, 0.05)"]
  );

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onChoice(true);
    } else if (info.offset.x < -threshold) {
      onChoice(false);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      style={{
        x,
        rotate,
        background,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        zIndex: 10
      }}
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: x.get() < 0 ? -500 : 500,
        opacity: 0,
        rotate: x.get() < 0 ? -45 : 45,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-panel"
    >
      <div style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--accent-gold)',
          paddingBottom: '0.5rem',
          textAlign: 'center',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {card.icon && <card.icon style={{ width: '1.25rem', height: '1.25rem' }} />}
          <span>{card.faction}</span>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: '1.5',
          color: 'var(--text-main)',
          pointerEvents: 'none'
        }}>
          "{card.text}"
        </div>

        {/* SWIPE OVERLAYS - CORRECTED ROTATION */}
        <motion.div style={{
          position: 'absolute', top: '2rem', right: '2rem', opacity: opacityYes,
          border: '4px solid var(--success)', color: 'var(--success)',
          padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '800', fontSize: '1.5rem', transform: 'rotate(15deg)'
        }}>
          ĐỒNG Ý
        </motion.div>
        <motion.div style={{
          position: 'absolute', top: '2rem', left: '2rem', opacity: opacityNo,
          border: '4px solid var(--danger)', color: 'var(--danger)',
          padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '800', fontSize: '1.5rem', transform: 'rotate(-15deg)'
        }}>
          TỪ CHỐI
        </motion.div>

        <div style={{ marginTop: '2rem', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>TỪ CHỐI</span>
            <span>ĐỒNG Ý</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ textAlign: 'left' }}>
              {Object.entries(card.no).map(([k, v]) => v !== 0 && (
                <div key={k} style={{ color: getChangeColor(v), fontSize: '0.9rem', marginBottom: '4px' }}>
                  {formatChange(v)} {statConfig[k].label}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              {Object.entries(card.yes).map(([k, v]) => v !== 0 && (
                <div key={k} style={{ color: getChangeColor(v), fontSize: '0.9rem', marginBottom: '4px' }}>
                  {formatChange(v)} {statConfig[k].label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <HandThumbDownIcon className="icon-sm" />
            <span>Kéo để chọn</span>
            <HandThumbUpIcon className="icon-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Game({ onGameOver }) {
  const [stats, setStats] = useState({
    people: 50,
    class: 50,
    idea: 50,
    intl: 50
  });

  const [turns, setTurns] = useState(0);
  const [triggeredEvents, setTriggeredEvents] = useState(new Set());
  const [permanentPenalties, setPermanentPenalties] = useState({
    people: 0, class: 0, idea: 0, intl: 0
  });
  const [pendingPenaltyWarning, setPendingPenaltyWarning] = useState(null);

  // New: Decision history, feedback, achievements
  const [decisionHistory, setDecisionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);

  // Ensure card has a unique key for AnimatePresence
  const [card, setCard] = useState({
    ...regularCards[Math.floor(Math.random() * regularCards.length)],
    uniqueId: Math.random().toString()
  });

  // Logic Helpers (Identical to before)
  const applyStatDecay = (currentStats, penalties) => {
    const decayed = { ...currentStats };
    decayed.people = clamp(decayed.people - 3);
    decayed.class = clamp(decayed.class - 3);
    decayed.idea = clamp(decayed.idea - 3);
    decayed.intl = clamp(decayed.intl - 4);
    return decayed;
  };

  const applyLinkedPenalties = (currentStats) => {
    const penalized = { ...currentStats };
    if (penalized.class > 75) penalized.people = clamp(penalized.people - 3);
    if (penalized.idea > 75 && penalized.people < 30) {
      penalized.people = clamp(penalized.people - 5);
      penalized.class = clamp(penalized.class - 3);
    }
    if (penalized.intl > 75 && penalized.class < 30) {
      penalized.class = clamp(penalized.class - 4);
      penalized.idea = clamp(penalized.idea - 3);
    }
    if (penalized.people > 75 && penalized.idea < 30) {
      penalized.idea = clamp(penalized.idea - 4);
      penalized.class = clamp(penalized.class - 3);
    }
    if (penalized.people > 75) {
      penalized.class = clamp(penalized.class - 4);
    }

    if (penalized.idea > 75) {
      penalized.people = clamp(penalized.people - 5);
    }

    if (penalized.intl > 75) {
      penalized.class = clamp(penalized.class - 3);
    }

    if (penalized.class > 75) {
      penalized.idea = clamp(penalized.idea - 3);
    }
    return penalized;
  };

  const checkCriticalThresholds = (currentStats, currentPenalties) => {
    const newPenalties = { ...currentPenalties };
    const triggeredStats = [];
    Object.keys(statConfig).forEach(key => {
      if (currentStats[key] <= 15 && newPenalties[key] === 0) {
        newPenalties[key] = -1;
        triggeredStats.push(statConfig[key].label);
      }
    });
    return { penalties: newPenalties, triggered: triggeredStats };
  };

  const getNextCard = (currentTurns, currentStats, alreadyTriggered) => {
    const turnEvent = turnBasedEvents.find(e => e.turn === currentTurns + 1);
    if (turnEvent) return { ...turnEvent, uniqueId: Math.random().toString() };

    for (const event of thresholdEvents) {
      if (!alreadyTriggered.has(event.id) && event.condition(currentStats)) {
        return { ...event, isThresholdEvent: true, uniqueId: Math.random().toString() };
      }
    }
    return {
      ...regularCards[Math.floor(Math.random() * regularCards.length)],
      uniqueId: Math.random().toString()
    };
  };

  // Check and unlock achievements
  const checkAchievements = (currentStats, currentTurns) => {
    const newAchievements = [...achievements];

    // 🕊️ Đại hòa hợp — tất cả 4 stats >= 60 tại đúng turn 15
    if (
      currentTurns === 15 &&
      !newAchievements.includes('great_harmony') &&
      currentStats.people >= 60 &&
      currentStats.class >= 60 &&
      currentStats.idea >= 60 &&
      currentStats.intl >= 60
    ) {
      newAchievements.push('great_harmony');
    }

    // ✝️ Người chăn dắt nhân từ — class >= 80 tại turn 20
    if (
      currentTurns === 20 &&
      !newAchievements.includes('shepherd') &&
      currentStats.class >= 80
    ) {
      newAchievements.push('shepherd');
    }

    // 🪷 Hộ Pháp — idea >= 75 tại turn 18
    if (
      currentTurns === 18 &&
      !newAchievements.includes('dharma_keeper') &&
      currentStats.idea >= 75
    ) {
      newAchievements.push('dharma_keeper');
    }

    // 🌉 Cầu nối liên tôn — intl >= 70 tại turn 22
    if (
      currentTurns === 22 &&
      !newAchievements.includes('unity_bridge') &&
      currentStats.intl >= 70
    ) {
      newAchievements.push('unity_bridge');
    }

    // ⚖️ Cân bằng đức tin — max - min <= 15 tại turn 20
    if (
      currentTurns === 20 &&
      !newAchievements.includes('balanced_faith')
    ) {
      const values = Object.values(currentStats);
      if (Math.max(...values) - Math.min(...values) <= 15) {
        newAchievements.push('balanced_faith');
      }
    }

    // 🏆 Vượt thử thách lịch sử — đạt turn 30 (xử lý trong onGameOver,
    // nhưng check ở đây phòng trường hợp turn 30 được gọi trước đó)
    if (
      currentTurns === 30 &&
      !newAchievements.includes('survivor')
    ) {
      newAchievements.push('survivor');
    }

    // 🛡️ Đức tin bền vững — tất cả stats >= 20 tại turn 25
    if (
      currentTurns === 25 &&
      !newAchievements.includes('steadfast_faith') &&
      currentStats.people >= 20 &&
      currentStats.class >= 20 &&
      currentStats.idea >= 20 &&
      currentStats.intl >= 20
    ) {
      newAchievements.push('steadfast_faith');
    }

    // ☸️ Giác ngộ — idea >= 85 tại turn 15
    // Note: check này và 'great_harmony' đều ở turn 15 — cả hai đều
    // được evaluate trong cùng một lần gọi, không xung đột nhau.
    if (
      currentTurns === 15 &&
      !newAchievements.includes('enlightened') &&
      currentStats.idea >= 85
    ) {
      newAchievements.push('enlightened');
    }

    // Chỉ update state nếu thực sự có achievement mới
    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
  };

  // Main Logic to Apply Choice
  const handleChoice = (agree) => {
    // 1. Check Penalty Warning
    if (card.isPenaltyWarning) {
      setPendingPenaltyWarning(null);
      setCard(getNextCard(turns, stats, triggeredEvents));
      return;
    }

    // 2. Calculate Stats
    const effects = agree ? card.yes : card.no;
    const newStats = { ...stats };
    let failedStatKey = null;

    for (const key in effects) {
      newStats[key] = clamp(newStats[key] + effects[key]);
      if (newStats[key] <= 0) failedStatKey = key;
    }

    // Immediate failure check
    if (failedStatKey) {
      onGameOver(newStats, turns, false, failedStatKey);
      return;
    }

    // 3. Update Game State (Turns, Decay, etc.)
    const newTurns = turns + 1;
    const newTriggered = new Set(triggeredEvents);

    if (newTurns >= 30) {
      onGameOver(newStats, newTurns, true);
      return;
    }

    if (card.isThresholdEvent) {
      newTriggered.add(card.id);
      setTriggeredEvents(newTriggered);
    }

    const { penalties: updatedPenalties, triggered: triggeredStats } = checkCriticalThresholds(newStats, permanentPenalties);
    setPermanentPenalties(updatedPenalties);

    let finalStats = applyStatDecay(newStats, updatedPenalties);
    finalStats = applyLinkedPenalties(finalStats);

    // Check death after decay
    const deadStat = Object.keys(finalStats).find(k => finalStats[k] <= 0);
    if (deadStat) {
      setStats(finalStats);
      setTimeout(() => onGameOver(finalStats, newTurns, false, deadStat), 300);
      return;
    }

    setStats(finalStats);
    setTurns(newTurns);

    // Track decision history
    const decision = {
      turn: newTurns,
      card: card.faction,
      choice: agree ? 'Đồng ý' : 'Từ chối',
      effects,
      oldStats: stats,
      newStats: finalStats
    };
    setDecisionHistory(prev => [decision, ...prev].slice(0, 10)); // Keep last 10

    // Check achievements
    checkAchievements(finalStats, newTurns);

    // 4. Set Next Card
    if (triggeredStats.length > 0) {
      setCard({
        isPenaltyWarning: true,
        faction: "⚠️ Cảnh báo",
        text: `${triggeredStats.join(', ')} đã đạt ngưỡng nguy hiểm! Bạn nhận phạt vĩnh viễn: -1 điểm mỗi lượt.`,
        yes: { people: 0, class: 0, idea: 0, intl: 0 },
        no: { people: 0, class: 0, idea: 0, intl: 0 },
        uniqueId: Math.random().toString()
      });
    } else {
      setCard(getNextCard(newTurns, finalStats, newTriggered));
    }
  };

  return (
    <div className="container" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 450px)',
      gap: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>

      {/* LEFT: Stats Panel */}
      <div className="card-panel" style={{
        padding: '2rem',
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--primary-red)', padding: '1rem', borderRadius: 'var(--radius-sm)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClockIcon className="icon-md" />
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Lượt {turns}/30</span>
          </div>
        </div>

        {[5, 10, 15, 20, 25].includes(turns + 1) && (
          <div className="event-warning" style={{ marginBottom: '1.5rem' }}>
            <ExclamationTriangleIcon className="icon-sm" style={{ display: 'inline', marginRight: 4 }} /> Sự kiện sắp tới
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(statConfig).map(([key, config]) => {
            const Icon = config.icon;
            const val = stats[key];
            const pen = permanentPenalties[key];

            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: val <= 15 ? 'var(--danger)' : 'var(--text-main)' }}>
                    <Icon className="icon-sm" />
                    {config.label}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {pen < 0 && <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{pen}</span>}
                    <span>{val}</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${val}%`,
                    height: '100%',
                    background: val <= 15 ? 'var(--danger)' : config.color,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          "Dĩ bất biến, ứng vạn biến"
        </div>
      </div>

      {/* CENTER: Main Card Area */}
      <div style={{
        height: '600px',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          <DraggableCard
            key={card.uniqueId}
            card={card}
            onChoice={handleChoice}
          />
        </AnimatePresence>

        {/* Feedback Screen Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                zIndex: 100,
                minWidth: '300px',
                border: '3px solid var(--accent-gold)'
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center', color: 'var(--primary-red)' }}>
                {feedback.choice === 'yes' ? '✓ ĐỒNG Ý' : '✗ TỪ CHỐI'}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center', fontStyle: 'italic' }}>
                "{feedback.card}"
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(feedback.effects || {}).map(([key, value]) => value !== 0 && (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{statConfig[key].label}</span>
                    <span style={{ color: value > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '700' }}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Notification */}
        <AnimatePresence>
          {showAchievement && achievements.length > 0 && achievements[achievements.length - 1] && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--accent-gold), #FFE55C)',
                color: '#333',
                padding: '1rem 2rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 150,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {achievementDefs.find(a => a.id === achievements[achievements.length - 1])?.icon}
              </span>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>THÀNH TỰU MỚI</div>
                <div>{achievementDefs.find(a => a.id === achievements[achievements.length - 1])?.name}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievements Panel */}
      <div className="card-panel" style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        padding: '1rem 1.5rem',
        maxWidth: '250px',
        zIndex: 40
      }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary-red)' }}>
          🏆 THÀNH TỰU ({achievements.length}/{achievementDefs.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {achievementDefs.map(achievement => {
            const unlocked = achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                title={`${achievement.name}: ${achievement.desc}`}
                style={{
                  fontSize: '1.5rem',
                  opacity: unlocked ? 1 : 0.3,
                  filter: unlocked ? 'none' : 'grayscale(100%)',
                  cursor: 'help'
                }}
              >
                {achievement.icon}
              </div>
            );
          })}
        </div>
      </div>

    </div>

  );

}
