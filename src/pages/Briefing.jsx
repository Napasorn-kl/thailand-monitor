import React, { useState, useCallback } from 'react';
import { TrendingUp, Brain, RefreshCw, Loader, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { BRIEFING_DATA } from '../data/staticData';

const IS_LOCAL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const GEMINI_ENDPOINT = IS_LOCAL
  ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  : '/api/gemini';

function SignalCard({ item }) {
  return (
    <div className="cc" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '.5px',
          padding: '2px 7px', borderRadius: 5,
          background: item.col + '20', color: item.col, border: '1px solid ' + item.col + '40',
        }}>
          {item.badge}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: item.col }}>{item.pct}</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 5, lineHeight: 1.35 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.5 }}>
        {item.desc}
      </div>
    </div>
  );
}

const TOP_COMPANIES = [
  { name:'PTT',          sector:'Energy',      cap:'฿1.2T', yoy:'+4.2%',  col:'#d97706' },
  { name:'SCG',          sector:'Construction',cap:'฿186B', yoy:'+2.8%',  col:'#22c55e' },
  { name:'CP Group',     sector:'Retail',      cap:'฿890B', yoy:'+6.1%',  col:'#3b82f6' },
  { name:'Central Group',sector:'Retail',      cap:'฿320B', yoy:'+8.4%',  col:'#3b82f6' },
  { name:'KASIKORN',     sector:'Finance',     cap:'฿520B', yoy:'+3.1%',  col:'#0ea5e9' },
  { name:'Thai Airways', sector:'Transport',   cap:'฿45B',  yoy:'-12.4%', col:'#f43f5e' },
];

function buildPrompt(indicators, newsHeadlines) {
  const { gdp, cpi, brent, exports: exp, tourism } = indicators;
  const headlineList = newsHeadlines.slice(0, 12).map((h, i) => `${i + 1}. ${h}`).join('\n');

  return `คุณเป็นนักเศรษฐศาสตร์ผู้เชี่ยวชาญด้านเศรษฐกิจไทย วิเคราะห์ข้อมูลปัจจุบันนี้:

ตัวชี้วัดเศรษฐกิจ:
- GDP Growth: ${gdp || 2.5}%
- CPI Inflation: ${cpi || 0.64}%
- ราคา Brent Crude: $${brent || 74}/barrel
- มูลค่าการส่งออก: $${exp || 24.1}B
- นักท่องเที่ยว: ${tourism || 15.9}M คน

ข่าวเศรษฐกิจล่าสุด:
${headlineList || 'ไม่มีข้อมูลข่าว'}

วิเคราะห์และตอบกลับเป็น JSON เท่านั้น (ไม่ต้องมี markdown หรือ code block) ตามโครงสร้างนี้:
{
  "summary": "สรุปภาพรวมเศรษฐกิจไทย 2-3 ประโยค",
  "opportunities": [
    { "badge": "OPPORTUNITY", "pct": "+X%", "title": "หัวข้อโอกาส", "desc": "คำอธิบาย 1-2 ประโยค", "col": "#059669" }
  ],
  "risks": [
    { "badge": "RISK", "pct": "-X%", "title": "หัวข้อความเสี่ยง", "desc": "คำอธิบาย 1-2 ประโยค", "col": "#dc2626" }
  ],
  "trends": [
    { "badge": "TREND", "pct": "~X%", "title": "หัวข้อแนวโน้ม", "desc": "คำอธิบาย 1-2 ประโยค", "col": "#0891b2" }
  ]
}

สร้าง opportunities 3 รายการ, risks 3 รายการ, trends 3 รายการ`;
}

async function callGemini(prompt, geminiKey) {
  if (IS_LOCAL) {
    if (!geminiKey) throw new Error('ต้องใส่ Gemini API Key ในหน้า Settings ก่อน');
    const r = await fetch(`${GEMINI_ENDPOINT}?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) throw new Error(`Gemini API error: ${r.status}`);
    const json = await r.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else {
    const r = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(35000),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error || `Server error: ${r.status}`);
    }
    const json = await r.json();
    return json.text || '';
  }
}

function parseAIResponse(text) {
  // Strip markdown fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON object from text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('ไม่สามารถอ่านผลลัพธ์จาก AI ได้');
  }
}

export default function Briefing({ data, newsHook }) {
  const { gdp, cpi, brent, exports: exports_, tourism } = data;
  const allArticles = newsHook?.allArticles || [];

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastGen, setLastGen] = useState(null);

  const ECON_SIGNALS = [
    { label: 'GDP Growth',      val: gdp ? gdp + '%' : '2.5%',      target: '3.0%', ok: parseFloat(gdp || 2.5) >= 2.5, src: 'World Bank' },
    { label: 'CPI Inflation',   val: cpi ? cpi + '%' : '0.64%',     target: '1–3%', ok: true, src: 'World Bank' },
    { label: 'Brent Crude',     val: brent ? '$' + brent : '$74.2', target: '<$80',  ok: parseFloat(brent || 74) < 80, src: 'Yahoo/EIA' },
    { label: 'Exports',         val: exports_ ? '$' + exports_ + 'B' : '$24.1B', target: '>$22B', ok: true, src: 'World Bank' },
    { label: 'Tourism Arrivals',val: tourism ? tourism + 'M' : '15.9M', target: '>12M', ok: true, src: 'World Bank' },
  ];

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const geminiKey = localStorage.getItem('gemini_api_key') || '';
      const headlines = allArticles.map(a => a.title).filter(Boolean);
      const prompt = buildPrompt({ gdp, cpi, brent, exports: exports_, tourism }, headlines);
      const rawText = await callGemini(prompt, geminiKey);
      const parsed = parseAIResponse(rawText);
      setAiData(parsed);
      setLastGen(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [gdp, cpi, brent, exports_, tourism, allArticles]);

  const displayData = aiData || BRIEFING_DATA;
  const isAI = !!aiData;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>AI Economic Briefing · Thailand</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>สัญญาณเศรษฐกิจ · โอกาส · ความเสี่ยง · แนวโน้ม</div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid rgba(8,145,178,.3)',
            background: loading ? 'rgba(8,145,178,.05)' : 'linear-gradient(135deg,#0891b2,#0369a1)',
            color: loading ? 'var(--cyan)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 12, fontWeight: 700,
            boxShadow: loading ? 'none' : '0 2px 8px rgba(8,145,178,.3)',
          }}
        >
          {loading
            ? <><Loader size={13} className="animate-spin-slow" /> กำลังวิเคราะห์...</>
            : <><Brain size={13} /> Generate AI Briefing</>
          }
        </button>
      </div>

      {/* AI status bar */}
      {(isAI || error) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          padding: '8px 14px', borderRadius: 8,
          background: error ? 'rgba(220,38,38,.06)' : 'rgba(5,150,105,.06)',
          border: '1px solid ' + (error ? 'rgba(220,38,38,.2)' : 'rgba(5,150,105,.2)'),
          fontSize: 11,
        }}>
          {error
            ? <><AlertTriangle size={13} color="#dc2626" /><span style={{ color: '#dc2626', fontWeight: 600 }}>{error}</span></>
            : <><Sparkles size={13} color="#059669" /><span style={{ color: '#059669', fontWeight: 600 }}>AI Analysis</span>
                <span style={{ color: 'var(--t3)' }}>· Gemini 1.5 Flash · {lastGen?.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
              </>
          }
        </div>
      )}

      {/* AI Summary */}
      {isAI && aiData.summary && (
        <div className="cc" style={{ marginBottom: 14, padding: '14px 16px', borderLeft: '3px solid var(--cyan)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--cyan)', marginBottom: 6, letterSpacing: '.5px' }}>AI SUMMARY</div>
          <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.6 }}>{aiData.summary}</div>
        </div>
      )}

      {/* Economic Signal grid */}
      <div className="cc" style={{ marginBottom: 14 }}>
        <div className="cc-title" style={{ marginBottom: 12 }}>Economic Signals · สถานะปัจจุบัน</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
          {ECON_SIGNALS.map(s => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 10,
              background: s.ok ? 'rgba(5,150,105,.05)' : 'rgba(220,38,38,.05)',
              border: '1px solid ' + (s.ok ? 'rgba(5,150,105,.2)' : 'rgba(220,38,38,.2)'),
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--t3)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.ok ? 'var(--green)' : 'var(--red)', lineHeight: 1.1, marginBottom: 3 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>target: {s.target}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>{s.src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities & Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            ▲ โอกาส {isAI && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--cyan)', background: 'rgba(8,145,178,.1)', borderRadius: 4, padding: '1px 5px' }}>AI</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayData.opportunities.map((item, i) => <SignalCard key={i} item={item} />)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            ▼ ความเสี่ยง {isAI && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--cyan)', background: 'rgba(8,145,178,.1)', borderRadius: 4, padding: '1px 5px' }}>AI</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayData.risks.map((item, i) => <SignalCard key={i} item={item} />)}
          </div>
        </div>
      </div>

      {/* Trends */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={13} /> แนวโน้มสำคัญ {isAI && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--cyan)', background: 'rgba(8,145,178,.1)', borderRadius: 4, padding: '1px 5px' }}>AI</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {displayData.trends.map((item, i) => <SignalCard key={i} item={item} />)}
        </div>
      </div>

      {/* Notable companies */}
      <div className="cc">
        <div className="cc-title" style={{ marginBottom: 12 }}>บริษัทที่น่าสนใจ · Top Corporates</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,.07)' }}>
                {['บริษัท', 'Sector', 'Market Cap', 'YoY'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '.3px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_COMPANIES.map((c, i) => {
                const isPos = c.yoy.startsWith('+');
                return (
                  <tr key={c.name} style={{ borderBottom: '1px solid rgba(0,0,0,.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,.015)' }}>
                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: c.col }} />
                        <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--t3)', fontSize: 11 }}>{c.sector}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--t1)' }}>{c.cap}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: isPos ? 'var(--green)' : 'var(--red)' }}>{c.yoy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No key hint */}
      {!isAI && !loading && (
        <div style={{
          marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(8,145,178,.04)', border: '1px dashed rgba(8,145,178,.25)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Brain size={16} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)' }}>ใส่ Gemini API Key เพื่อเปิดใช้ AI วิเคราะห์จริง</div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>
              ไปที่ Settings → Gemini API Key · สมัครฟรีที่ aistudio.google.com · ไม่ต้องใช้บัตรเครดิต
            </div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--t3)', marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      )}
    </div>
  );
}
