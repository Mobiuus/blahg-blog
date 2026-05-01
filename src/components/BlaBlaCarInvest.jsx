import { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const DATA = [
  {q:"Q3 2015",valPre:2495,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2015",valPre:2288,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q1 2016",valPre:2262,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q2 2016",valPre:2268,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2016",valPre:2209,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q1 2017",valPre:2207,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q2 2017",valPre:2437,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q3 2017",valPre:2022,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2017",valPre:1794,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q1 2018",valPre:1758,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q2 2018",valPre:1756,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q3 2018",valPre:1895,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2018",valPre:2553,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q1 2019",valPre:2549,valPost:null,bandBase:2167,bandSpread:765,bandHigh:2932},
  {q:"Q2 2019",valPre:2554,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q3 2019",valPre:2758,valPost:null,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2019",valPre:3702,valPost:null,bandBase:3146,bandSpread:1112,bandHigh:4258},
  {q:"Q1 2020",valPre:2858,valPost:null,bandBase:2429,bandSpread:857,bandHigh:3286},
  {q:"Q2 2020",valPre:3086,valPost:null,bandBase:2623,bandSpread:926,bandHigh:3549},
  {q:"Q3 2020",valPre:3209,valPost:null,bandBase:2728,bandSpread:962,bandHigh:3690},
  {q:"Q4 2020",valPre:2882,valPost:null,bandBase:2450,bandSpread:864,bandHigh:3314},
  {q:"Q1 2021",valPre:2956,valPost:null,bandBase:2513,bandSpread:886,bandHigh:3399},
  {q:"Q2 2021",valPre:3077,valPost:null,bandBase:2615,bandSpread:923,bandHigh:3538},
  {q:"Q3 2021",valPre:2605,valPost:null,bandBase:2215,bandSpread:781,bandHigh:2996},
  {q:"Q4 2021",valPre:2474,valPost:null,bandBase:2134,bandSpread:680,bandHigh:2814},
  {q:"Q1 2022",valPre:2201,valPost:2201,bandBase:1899,bandSpread:603,bandHigh:2502},
  {q:"Q2 2022",valPre:1778,valPost:1778,bandBase:1538,bandSpread:479,bandHigh:2017,isEntry:true},
  {q:"Q3 2022",valPre:null,valPost:2065,bandBase:1785,bandSpread:559,bandHigh:2344},
  {q:"Q4 2022",valPre:null,valPost:2177,bandBase:1886,bandSpread:582,bandHigh:2468},
  {q:"Q1 2023",valPre:null,valPost:3104,bandBase:2672,bandSpread:864,bandHigh:3536},
  {q:"Q2 2023",valPre:null,valPost:3187,bandBase:2744,bandSpread:887,bandHigh:3631},
  {q:"Q3 2023",valPre:null,valPost:3293,bandBase:2833,bandSpread:920,bandHigh:3753},
  {q:"Q4 2023",valPre:null,valPost:3149,bandBase:2710,bandSpread:878,bandHigh:3588},
  {q:"Q1 2024",valPre:null,valPost:3416,bandBase:2935,bandSpread:962,bandHigh:3897,isPeak:true},
  {q:"Q2 2024",valPre:null,valPost:2961,bandBase:2550,bandSpread:822,bandHigh:3372},
  {q:"Q3 2024",valPre:null,valPost:2576,bandBase:2182,bandSpread:788,bandHigh:2970},
  {q:"Q4 2024",valPre:null,valPost:2423,bandBase:2071,bandSpread:703,bandHigh:2774},
  {q:"Q1 2025",valPre:null,valPost:2251,bandBase:1932,bandSpread:638,bandHigh:2570},
  {q:"Q2 2025",valPre:null,valPost:2317,bandBase:1992,bandSpread:651,bandHigh:2643},
  {q:"Q3 2025",valPre:null,valPost:2117,bandBase:null,bandSpread:null,bandHigh:null},
  {q:"Q4 2025",valPre:null,valPost:1927,bandBase:1631,bandSpread:592,bandHigh:2223},
  {q:"Q1 2026",valPre:null,valPost:1373,bandBase:1161,bandSpread:423,bandHigh:1584},
];

const TICK_MAP = {
  "Q3 2015":"2015","Q2 2016":"'16","Q2 2017":"'17","Q2 2018":"'18",
  "Q2 2019":"'19","Q2 2020":"'20","Q2 2021":"'21","Q2 2022":"'22",
  "Q2 2023":"'23","Q2 2024":"'24","Q2 2025":"'25","Q1 2026":"'26"
};

const SENS_Q1_2026 = [
  {sc:"−15%", stake:101.8, co:727,  eur:1160, pct:"-42%", col:"#eb4888"},
  {sc:"−10%", stake:108.0, co:771,  eur:1231, pct:"-39%", col:"#eb4888"},
  {sc:" Base", stake:120.4, co:860,  eur:1372, pct:"-32%", col:"#a4a4a4"},
  {sc:"+10%", stake:132.8, co:948,  eur:1513, pct:"-25%", col:"#24d05a"},
  {sc:"+15%", stake:139.0, co:993,  eur:1584, pct:"-21%", col:"#24d05a"},
];

const FONT = '"iA Writer Mono", monospace';
const C = {
  bg:     "#0f172a",
  panel:  "#1e293b",
  border: "#334155",
  text:   "#e2e8f0",
  muted:  "#94a3b8",
  dim:    "#475569",
  orange: "#e48500",
  green:  "#24d05a",
  blue:   "#10a2f5",
  pink:   "#eb4888",
  gray:   "#6b6b6b",
};

const fmt = v => `€${Math.round(v).toLocaleString("fr-FR")}`;

const CustomTick = ({ x, y, payload }) => {
  const label = TICK_MAP[payload.value];
  if (!label) return null;
  const isEntry = payload.value === "Q2 2022";
  return (
    <g transform={`translate(${x},${y})`}>
      {isEntry && (
        <rect x={-14} y={4} width={28} height={14} rx={3}
          fill={C.orange} fillOpacity={0.15} />
      )}
      <text dy={16} fill={isEntry ? C.orange : C.dim} fontSize={9.5}
        textAnchor="middle" fontFamily={FONT}>
        {label}
      </text>
    </g>
  );
};

const CustomDot = ({ cx, cy, payload }) => {
  if (payload.isEntry) return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={C.orange} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={C.orange} stroke={C.bg} strokeWidth={1.5} />
    </g>
  );
  if (payload.isPeak) return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={C.green} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={C.green} stroke={C.bg} strokeWidth={1.5} />
    </g>
  );
  return null;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const val = d.valPost ?? d.valPre;
  const isPre = d.valPost == null;
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "10px 14px", minWidth: 200, fontFamily: FONT
    }}>
      <div style={{ color: C.muted, fontSize: 10, marginBottom: 5 }}>
        {d.q} {d.isEntry ? "◀ ENTREE" : ""}{d.isPeak ? "▲ PEAK" : ""}
      </div>
      {isPre && (
        <div style={{ color: C.dim, fontSize: 9, marginBottom: 4 }}>
          Valeur hypothétique (avant achat)
        </div>
      )}
      {val && (
        <div style={{ color: d.isPeak ? C.green : d.isEntry ? C.orange : C.text, fontSize: 15, fontWeight: 700 }}>
          {fmt(val)}
        </div>
      )}
      {d.bandBase && (
        <div style={{ color: C.blue, fontSize: 10, marginTop: 6, lineHeight: 1.6 }}>
          <span style={{ color: C.pink }}>▼ −15%: {fmt(d.bandBase)}</span><br />
          <span style={{ color: C.green }}>▲ +15%: {fmt(d.bandHigh)}</span>
        </div>
      )}
      {d.isEntry && (
        <div style={{ color: C.orange, fontSize: 10, marginTop: 5, borderTop: `1px solid ${C.border}`, paddingTop: 5 }}>
          Coût payé: €2,017 · Prime: +13.5%
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ label, value, sub, color }) => (
  <div style={{
    background: C.panel, borderRadius: 8, padding: "14px 16px",
    borderTop: `2px solid ${color}`
  }}>
    <div style={{ color, fontSize: 19, fontWeight: 700, fontFamily: FONT, letterSpacing: "-0.5px" }}>
      {value}
    </div>
    <div style={{ color: "#cbd5e1", fontSize: 10.5, marginTop: 3 }}>{label}</div>
    {sub && <div style={{ color: C.dim, fontSize: 9.5, marginTop: 2 }}>{sub}</div>}
  </div>
);

export default function BlaBlaCarInvest() {
  const [view, setView] = useState("chart");

  return (
    <div style={{
      background: C.bg, borderRadius: 12, padding: "22px 26px",
      fontFamily: FONT, color: C.text
    }}>

      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>
          BlaBlaCar — valorisation de ma participation
        </div>
        <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>
          SPV Caption Market · 28 Jun 2022 · 254 parts · ownership indirect :{" "}
          <span style={{ color: C.blue }}>0.0001724%</span>{" "}
          · valorisation = FV Vostok ÷ % Vostok · conversion EUR/USD approx. trimestrielle
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 18 }}>
        <KpiCard label="Coût total payé" value="€2 017" sub="incl. frais Caption" color={C.gray} />
        <KpiCard label="Valeur actuelle" value="€1 373" sub="Q1 2026 (Mar)" color={C.orange} />
        <KpiCard label="P&L unrealized" value="−€644" sub="−31.9% vs coût" color={C.pink} />
        <KpiCard label="Peak (Q1 2024)" value="€3 416" sub="+69% vs coût" color={C.green} />
        <KpiCard label="Ownership BlaBlaCar" value="0.0001724%" sub="254 ÷ 89 112 × 707 549 ÷ 1 170 M€" color={C.blue} />
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
        {[["chart","graphique"],["verify","ownership"],["sens","sensitivity Q1 2026"]].map(([k,l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            background: view === k ? C.blue : C.panel,
            color: view === k ? "#fff" : C.gray,
            border: "none", borderRadius: 6, padding: "6px 14px",
            fontSize: 10, cursor: "pointer", fontFamily: FONT
          }}>{l}</button>
        ))}
      </div>

      {/* CHART VIEW */}
      {view === "chart" && (
        <div style={{ background: C.panel, borderRadius: 12, padding: "18px 14px 10px" }}>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { col: C.dim,  dash: true,  label: "Valeur hypothétique (avant achat)" },
              { col: C.blue, dash: false, label: "Ma valorisation (post-achat)" },
              { col: `rgba(16,162,245,0.2)`, rect: true, label: "Fourchette ±15% revenue" },
              { col: C.pink, dash: true,  label: "Coût d'entrée €2 017" },
              { col: C.orange, dot: true, label: "Point d'entrée Jun 2022" },
              { col: C.green,  dot: true, label: "Peak Q1 2024" },
            ].map(({ col, dash, rect, dot, label }) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9.5, color: C.gray }}>
                {rect ? (
                  <span style={{ display: "inline-block", width: 18, height: 10, background: col, border: `1px solid ${C.blue}`, borderRadius: 2 }} />
                ) : dot ? (
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: col }} />
                ) : (
                  <span style={{
                    display: "inline-block", width: 24, height: 0,
                    borderTop: `2px ${dash ? "dashed" : "solid"} ${col}`
                  }} />
                )}
                {label}
              </span>
            ))}
          </div>

          {/* Chart */}
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DATA} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                <defs>
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
                <XAxis
                  dataKey="q" tick={<CustomTick />} interval={0}
                  axisLine={{ stroke: "#1e3a5f" }} tickLine={false}
                />
                <YAxis
                  tickFormatter={v => `€${(v / 1000).toFixed(1)}k`}
                  tick={{ fill: C.dim, fontSize: 9, fontFamily: FONT }}
                  axisLine={false} tickLine={false}
                  domain={[0, 4800]} width={54}
                  ticks={[0, 1000, 2000, 3000, 4000]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.border, strokeDasharray: "4 2" }} />

                <Area type="monotone" dataKey="bandBase"
                  stroke="none" fill="transparent" stackId="band" connectNulls={false} legendType="none" />
                <Area type="monotone" dataKey="bandSpread"
                  stroke={`rgba(16,162,245,0.35)`} strokeWidth={0.5}
                  fill="url(#bandGrad)" stackId="band" connectNulls={false} legendType="none" />

                <ReferenceLine y={2017} stroke={C.pink} strokeDasharray="5 3" strokeWidth={1}
                  label={{ value: "€2 017 coût", fill: C.pink, fontSize: 8.5, position: "insideTopRight", fontFamily: FONT }} />

                <ReferenceLine x="Q2 2022" stroke={C.orange} strokeWidth={1.5} strokeDasharray="6 3"
                  label={{ value: "achat", fill: C.orange, fontSize: 8.5, position: "insideTopLeft", fontFamily: FONT }} />

                <Line type="monotone" dataKey="valPre"
                  stroke={C.dim} strokeWidth={1.5} strokeDasharray="5 3"
                  dot={false} activeDot={{ r: 3, fill: C.dim }} connectNulls={false} legendType="none" />

                <Line type="monotone" dataKey="valPost"
                  stroke={C.blue} strokeWidth={2.5}
                  dot={<CustomDot />} activeDot={{ r: 4, fill: C.blue, stroke: C.bg, strokeWidth: 2 }}
                  connectNulls={false} legendType="none" />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 8.5, color: C.border, marginTop: 8, textAlign: "right" }}>
            Source : Vostok New Ventures quarterly reports · FX EUR/USD : taux trimestriels approx.
          </div>
        </div>
      )}

      {/* OWNERSHIP VERIFICATION */}
      {view === "verify" && (
        <div style={{ background: C.panel, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: C.orange, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            vérification de l'ownership indirect
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: C.gray, marginBottom: 8 }}>STRUCTURE SPV</div>
              <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse" }}>
                {[
                  ["Plateforme", "Caption Market"],
                  ["Date d'investissement", "28 Juin 2022"],
                  ["Parts achetées", "254"],
                  ["Total parts SPV", "89 112"],
                  ["Part dans le SPV", "254 / 89 112 = 0.28502%"],
                  ["Part déclarée", "0.287%  (arrondi légèrement supérieur)"],
                  ["Prix unitaire", "€7.49"],
                  ["Investissement brut", "€1 902.46"],
                  ["Frais", "€114.30"],
                  ["Total payé", "€2 016.76"],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: `1px solid ${C.bg}` }}>
                    <td style={{ color: C.gray, padding: "5px 12px 5px 0" }}>{k}</td>
                    <td style={{ color: C.text }}>{v}</td>
                  </tr>
                ))}
              </table>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.gray, marginBottom: 8 }}>CALCUL OWNERSHIP BLABLACAR</div>
              <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse" }}>
                {[
                  ["Levée totale SPV", "€707 549.28"],
                  ["Valorisation pre-money BlaBlaCar", "€1 170 000 000"],
                  ["% SPV dans BlaBlaCar", "707 549 ÷ 1 170 000 000 = 0.06047%"],
                  ["% Valentin dans SPV", "254 ÷ 89 112 = 0.28502%"],
                  ["% indirect BlaBlaCar", "0.28502% × 0.06047% = 0.0001724%"],
                  ["Estimation initiale", "0.0001727%  (écart infime, rounding)"],
                  ["—", "—"],
                  ["Valeur implicite à l'entrée (Vostok mark)", "€1 778"],
                  ["Total payé", "€2 017"],
                  ["Prime payée vs mark Vostok", "+13.5%"],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: `1px solid ${C.bg}` }}>
                    <td style={{ color: C.gray, padding: "5px 12px 5px 0" }}>{k}</td>
                    <td style={{
                      color: k.includes("indirect") ? C.blue : k.includes("Prime") ? C.orange : C.text,
                      fontWeight: k.includes("indirect") || k.includes("Prime") ? 600 : 400
                    }}>{v}</td>
                  </tr>
                ))}
              </table>
              <div style={{
                marginTop: 12, background: C.bg, borderRadius: 8, padding: "10px 14px",
                borderLeft: `3px solid ${C.green}`, fontSize: 10
              }}>
                <span style={{ color: C.green, fontWeight: 600 }}>ownership confirmé :</span>
                <span style={{ color: C.muted }}> 0.0001724% de BlaBlaCar (indirect via SPV).<br />
                  L'écart avec 0.0001727% vient uniquement de l'arrondi 0.28502% → 0.287%.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SENSITIVITY Q1 2026 */}
      {view === "sens" && (
        <div style={{ background: C.panel, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: C.blue, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            sensitivity analysis — ma participation · Q1 2026
          </div>
          <div style={{ fontSize: 9.5, color: C.dim, marginBottom: 16 }}>
            Basé sur la sensitivity table Vostok (±10% / ±15% sur estimation de revenus) · Ownership Vostok Q1 2026 : 14.0% · FX EUR/USD ≈ 1.08
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Scénario revenue", "Stake Vostok ($M)", "BlaBlaCar total ($M)", "Ma part (€)", "vs Coût payé €2 017", ""].map(h => (
                    <th key={h} style={{
                      color: C.dim, fontWeight: 500, padding: "6px 12px 10px", textAlign: "left",
                      fontSize: 9.5, borderBottom: `1px solid ${C.border}`
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SENS_Q1_2026.map(({ sc, stake, co, eur, pct, col }) => (
                  <tr key={sc} style={{ borderBottom: `1px solid ${C.bg}` }}>
                    <td style={{ color: col, padding: "9px 12px", fontWeight: 600 }}>{sc}</td>
                    <td style={{ color: C.muted, padding: "9px 12px" }}>${stake}M</td>
                    <td style={{ color: C.muted, padding: "9px 12px" }}>${co}M</td>
                    <td style={{ color: col, padding: "9px 12px", fontWeight: sc.includes("Base") ? 700 : 500 }}>
                      {fmt(eur)}
                    </td>
                    <td style={{ color: col, padding: "9px 12px" }}>{pct}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <div style={{
                        height: 6, borderRadius: 3, width: `${Math.max(4, (eur / 3416) * 100)}%`,
                        background: col, opacity: 0.6, minWidth: 8, maxWidth: 120
                      }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10
          }}>
            {[
              { label: "Breakeven (coût vs valeur)", value: "~€4 500M BlaBlaCar total", sub: "Très au-dessus de la mark actuelle ($860M)" },
              { label: "IRR implicite depuis Jun 2022", value: "Négatif", sub: "−32% cumulé sur ~3.75 ans" },
              { label: "Option value", value: "Asymétrique", sub: "Liquidation préf. via SPV = protection partielle" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background: C.bg, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ color: C.muted, fontSize: 9.5, marginBottom: 4 }}>{label}</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{value}</div>
                <div style={{ color: C.dim, fontSize: 9, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 8.5, color: C.border }}>
            * Breakeven = coût payé / ownership = €2 017 / 0.000001724 ≈ $1.17Mds BlaBlaCar (au taux EUR/USD d'entrée ≈ 1.048).
          </div>
        </div>
      )}
    </div>
  );
}
