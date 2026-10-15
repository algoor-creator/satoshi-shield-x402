import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [target, setTarget] = useState('');
  const [chainId, setChainId] = useState('8453');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [x402Demo, setX402Demo] = useState(null);

  const runScan = async (e, presetTarget = null, presetChain = null) => {
    if (e) e.preventDefault();
    const queryTarget = presetTarget || target;
    const queryChain = presetChain || chainId;
    if (!queryTarget) return;

    if (presetTarget) setTarget(presetTarget);
    if (presetChain) setChainId(presetChain);

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/scan?target=${encodeURIComponent(queryTarget)}&chainId=${queryChain}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Scan failed. Please try again.' });
    }
    setLoading(false);
  };

  const testX402Endpoint = async () => {
    const res = await fetch(`/api/x402-audit?target=${encodeURIComponent(target || 'ecosdesatoshi.com')}`);
    const data = await res.json();
    setX402Demo(data);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>SatoshiShield · Web3 Smart Contract & Domain Security Scanner (Base + x402)</title>
        <meta name="description" content="Open-source security scanner for Base smart contracts and domain DNS/HTTP headers with native x402 AI Agent micropayments." />
      </Head>

      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #0f172a, #1e293b)', borderBottom: '1px solid #334155', padding: '10px 20px', fontSize: '13px', textAlign: 'center', color: '#94a3b8' }}>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>LIVE ON BASE & x402:</span> Open-Source Public Good by <strong>Ecos de Satoshi</strong> · Built for Humans & AI Agents · Zero-Database Architecture
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', width: '100%', margin: '0 auto', padding: '40px 20px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-block', background: '#0ea5e920', border: '1px solid #0ea5e960', color: '#38bdf8', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
            BASE ECOSYSTEM · GOPLUS SECURITY · DNS DELIVERABILITY · HTTP 402
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            SatoshiShield Security Scanner
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '17px', maxWidth: '680px', margin: '0 auto' }}>
            Instant security telemetry for <strong>EVM Smart Contracts</strong> (honeypots, taxes, mint risks) and <strong>Web Domains</strong> (SPF, DMARC, anti-phishing & HTTP headers).
          </p>
        </div>

        {/* Search Box */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', marginBottom: '28px' }}>
          <form onSubmit={(e) => runScan(e)} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <select
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', fontWeight: 600 }}
            >
              <option value="8453">🔵 Base Mainnet</option>
              <option value="1">⟠ Ethereum</option>
              <option value="42161">🔷 Arbitrum</option>
              <option value="56">🟡 BNB Chain</option>
            </select>

            <input
              type="text"
              placeholder="Paste 0x Contract Address OR Domain (e.g. uniswap.org, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              style={{ flex: 1, minWidth: '260px', background: '#070b14', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '12px 16px', fontSize: '15px' }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
            >
              {loading ? 'Scanning...' : 'Run Security Audit'}
            </button>
          </form>

          {/* Quick Test Buttons */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
            <span>Try instant demo:</span>
            <button onClick={(e) => runScan(e, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', '8453')} style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
              USDC on Base (Contract)
            </button>
            <button onClick={(e) => runScan(e, 'ecosdesatoshi.com', '8453')} style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
              ecosdesatoshi.com (Domain)
            </button>
            <button onClick={(e) => runScan(e, 'base.org', '8453')} style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
              base.org (DNS & Headers)
            </button>
          </div>
        </div>

        {/* Scan Results */}
        {result && !result.error && (
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
                  {result.mode === 'web3_contract' ? 'EVM Smart Contract Audit' : 'Domain & DNS Security Audit'}
                </span>
                <h2 style={{ fontSize: '22px', color: '#f8fafc', marginTop: '4px' }}>
                  {result.mode === 'web3_contract' ? `${result.tokenName} (${result.tokenSymbol})` : result.domain}
                </h2>
              </div>

              <div style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px',
                background: result.riskScore >= 50 ? '#ef444425' : result.riskScore >= 20 ? '#f59e0b25' : '#10b98125',
                color: result.riskScore >= 50 ? '#f87171' : result.riskScore >= 20 ? '#fbbf24' : '#34d399',
                border: `1px solid ${result.riskScore >= 50 ? '#ef4444' : result.riskScore >= 20 ? '#f59e0b' : '#10b981'}`
              }}>
                Risk Score: {result.riskScore}/100 · {result.verdict}
              </div>
            </div>

            {/* Security Flags */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>Security Findings</h3>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '8px' }}>
                {result.flags?.map((flag, idx) => (
                  <li key={idx} style={{ background: '#070b14', border: '1px solid #1e293b', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Telemetry Grid */}
            {result.mode === 'web3_contract' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Verified Code</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.metrics.isOpenSource ? 'Yes ✅' : 'No ❌'}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Buy / Sell Tax</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.metrics.buyTax} / {result.metrics.sellTax}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Liquidity (USD)</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>${Number(result.liquidityUsd).toLocaleString()}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Holders</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.metrics.holderCount}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>SPF Record</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.dns.spfConfigured ? 'Configured ✅' : 'Missing ❌'}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>DMARC Policy</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.dns.dmarcConfigured ? (result.dns.strictDmarc ? 'Strict ✅' : 'Weak (none) ⚠️') : 'Missing ❌'}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>HSTS Header</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.httpHeaders.hsts ? 'Active ✅' : 'Missing ❌'}</div>
                </div>
                <div style={{ background: '#070b14', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Clickjacking Protection</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{result.httpHeaders.xFrame ? 'Active ✅' : 'Missing ❌'}</div>
                </div>
              </div>
            )}

            {/* Direct Monetization CTA Box */}
            <div style={{ background: 'linear-gradient(90deg, #0f2942, #0d3b4c)', border: '1px solid #0284c7', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '15px' }}>
                  Need urgent remediation, DNS/DMARC hardening, or wallet revoke support?
                </div>
                <div style={{ fontSize: '13px', color: '#bae6fd' }}>
                  Fixed-fee turnaround in 24h by Ecos de Satoshi ($95 / 90€ flat fee · Zero database access needed).
                </div>
              </div>
              <a
                href="mailto:ecodesatoshi@gmail.com?subject=Security%20Remediation%20Request%20-%20SatoshiShield"
                style={{ background: '#38bdf8', color: '#070b14', fontWeight: 800, padding: '10px 18px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' }}
              >
                Request Turnkey Fix →
              </a>
            </div>
          </div>
        )}

        {/* Two-Column Feature Section: x402 Protocol + Public Good Funding */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {/* x402 AI Agent Box */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>HTTP 402 · BASE MAINNET USDC</div>
            <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '8px' }}>x402 AI Agent Security API</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '14px' }}>
              Autonomous AI agents and bots can query <code>/api/x402-audit</code> for deep machine-readable security telemetry using native USDC micropayments (0.25 USDC/call) on Base.
            </p>
            <button
              onClick={testX402Endpoint}
              style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Inspect HTTP 402 Handshake
            </button>
            {x402Demo && (
              <pre style={{ marginTop: '12px', background: '#070b14', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#34d399', overflowX: 'auto', border: '1px solid #1e293b' }}>
                {JSON.stringify(x402Demo, null, 2)}
              </pre>
            )}
          </div>

          {/* Builder & Grant Verification Box */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '22px' }}>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>OPEN-SOURCE PUBLIC GOOD</div>
            <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '8px' }}>Builder & Grant Verification</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>
              Built by <strong>Alejandro González Ortiz</strong> (<a href="https://ecosdesatoshi.com" target="_blank" rel="noreferrer">Ecos de Satoshi</a>). Designed to protect everyday users and small businesses from honeypots and domain spoofing.
            </p>
            <div style={{ background: '#070b14', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '12px', wordBreak: 'break-all', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>Base / EVM Receiving Address:</span><br />
              <code style={{ color: '#f8fafc' }}>0x9e041bcb426026bd055ff590e63416b5d8271616</code>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Machine-readable metadata: <a href="/funding.json" target="_blank">/funding.json</a>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #1e293b', padding: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
        SatoshiShield · Powered by GoPlus Security API, Google DoH & x402 Protocol on Base · <a href="https://ecosdesatoshi.com">ecosdesatoshi.com</a>
      </footer>
    </div>
  );
}
