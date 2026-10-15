export default async function handler(req, res) {
  const { target, chainId = '8453', type = 'auto' } = req.query;

  if (!target) {
    return res.status(400).json({ error: 'Please provide a contract address or domain name.' });
  }

  const cleanTarget = target.trim();
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(cleanTarget);

  try {
    if (isAddress || type === 'token') {
      // 1. Query GoPlus Token Security API (100% Free, no key required for basic queries)
      const goplusUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${cleanTarget.toLowerCase()}`;
      const dexUrl = `https://api.dexscreener.com/latest/dex/tokens/${cleanTarget}`;

      const [goplusRes, dexRes] = await Promise.all([
        fetch(goplusUrl).then(r => r.json()).catch(() => null),
        fetch(dexUrl).then(r => r.json()).catch(() => null)
      ]);

      const tokenData = goplusRes?.result?.[cleanTarget.toLowerCase()] || {};
      const pairData = dexRes?.pairs?.[0] || null;

      // Calculate Risk Score
      let riskScore = 0;
      const flags = [];

      if (tokenData.is_honeypot === '1') { riskScore += 60; flags.push('CRITICAL: Honeypot detected (Cannot sell)'); }
      if (tokenData.is_mintable === '1') { riskScore += 20; flags.push('HIGH: Mintable supply (Creator can mint new tokens)'); }
      if (tokenData.can_take_back_ownership === '1') { riskScore += 20; flags.push('HIGH: Ownership can be reclaimed'); }
      if (tokenData.hidden_owner === '1') { riskScore += 15; flags.push('MEDIUM: Hidden owner detected'); }
      if (Number(tokenData.sell_tax || 0) > 0.1) { riskScore += 25; flags.push(`HIGH: High Sell Tax (${(Number(tokenData.sell_tax)*100).toFixed(1)}%)`); }
      if (Number(tokenData.buy_tax || 0) > 0.1) { riskScore += 15; flags.push(`MEDIUM: High Buy Tax (${(Number(tokenData.buy_tax)*100).toFixed(1)}%)`); }
      if (tokenData.is_open_source === '0') { riskScore += 30; flags.push('HIGH: Contract source code is NOT verified'); }

      if (flags.length === 0 && Object.keys(tokenData).length > 0) {
        flags.push('PASSED: No standard honeypot or malicious tax flags found.');
      } else if (Object.keys(tokenData).length === 0) {
        flags.push('INFO: Contract not indexed as standard ERC-20 token or new deployment.');
      }

      return res.status(200).json({
        mode: 'web3_contract',
        chainId,
        address: cleanTarget,
        tokenName: tokenData.token_name || pairData?.baseToken?.name || 'Unknown / Custom Contract',
        tokenSymbol: tokenData.token_symbol || pairData?.baseToken?.symbol || 'N/A',
        priceUsd: pairData?.priceUsd || 'N/A',
        liquidityUsd: pairData?.liquidity?.usd || 0,
        riskScore: Math.min(riskScore, 100),
        verdict: riskScore >= 50 ? 'DANGER' : riskScore >= 20 ? 'WARNING' : 'SAFE',
        flags,
        metrics: {
          isOpenSource: tokenData.is_open_source === '1',
          isHoneypot: tokenData.is_honeypot === '1',
          buyTax: tokenData.buy_tax ? `${(Number(tokenData.buy_tax)*100).toFixed(1)}%` : '0%',
          sellTax: tokenData.sell_tax ? `${(Number(tokenData.sell_tax)*100).toFixed(1)}%` : '0%',
          holderCount: tokenData.holder_count || 'N/A'
        },
        timestamp: new Date().toISOString()
      });
    } else {
      // Domain / Phishing / DNS Deliverability & Header Security Scanner (Zero Database, Google DNS-over-HTTPS)
      const domain = cleanTarget.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

      const [txtRes, dmarcRes] = await Promise.all([
        fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=TXT`).then(r => r.json()).catch(() => null),
        fetch(`https://dns.google/resolve?name=_dmarc.${encodeURIComponent(domain)}&type=TXT`).then(r => r.json()).catch(() => null)
      ]);

      const txtRecords = (txtRes?.Answer || []).map(a => a.data.replace(/"/g, ''));
      const dmarcRecords = (dmarcRes?.Answer || []).map(a => a.data.replace(/"/g, ''));

      const hasSpf = txtRecords.some(r => r.toLowerCase().includes('v=spf1'));
      const hasDmarc = dmarcRecords.some(r => r.toLowerCase().includes('v=dmarc1'));
      const strictDmarc = dmarcRecords.some(r => r.toLowerCase().includes('p=reject') || r.toLowerCase().includes('p=quarantine'));

      // Check HTTP Security Headers passively
      let headersData = {};
      try {
        const headResp = await fetch(`https://${domain}`, { method: 'HEAD', redirect: 'follow' });
        headersData = {
          hsts: headResp.headers.get('strict-transport-security') ? true : false,
          xFrame: headResp.headers.get('x-frame-options') ? true : false,
          xContentType: headResp.headers.get('x-content-type-options') ? true : false,
          csp: headResp.headers.get('content-security-policy') ? true : false,
          server: headResp.headers.get('server') || 'Hidden'
        };
      } catch (e) {
        headersData = { hsts: false, xFrame: false, xContentType: false, csp: false, error: 'Could not reach HTTPS endpoint' };
      }

      let riskScore = 0;
      const flags = [];

      if (!hasSpf) { riskScore += 25; flags.push('HIGH: Missing SPF record (Vulnerable to email spoofing)'); }
      if (!hasDmarc) { riskScore += 30; flags.push('HIGH: Missing DMARC policy (Domain can be impersonated in phishing)'); }
      else if (!strictDmarc) { riskScore += 15; flags.push('MEDIUM: DMARC policy is set to p=none (Monitoring only, not blocking spoofing)'); }

      if (!headersData.hsts) { riskScore += 15; flags.push('MEDIUM: Missing HSTS header (Strict-Transport-Security)'); }
      if (!headersData.xFrame) { riskScore += 15; flags.push('MEDIUM: Missing X-Frame-Options header (Clickjacking risk)'); }
      if (!headersData.xContentType) { riskScore += 10; flags.push('LOW: Missing X-Content-Type-Options nosniff header'); }

      if (flags.length === 0) {
        flags.push('PASSED: Strong DNS email authentication and HTTP security headers.');
      }

      return res.status(200).json({
        mode: 'domain_security',
        domain,
        riskScore: Math.min(riskScore, 100),
        verdict: riskScore >= 50 ? 'VULNERABLE' : riskScore >= 20 ? 'NEEDS_HARDENING' : 'SECURE',
        flags,
        dns: {
          spfConfigured: hasSpf,
          dmarcConfigured: hasDmarc,
          strictDmarc,
          rawSpf: txtRecords.find(r => r.toLowerCase().includes('v=spf1')) || 'None',
          rawDmarc: dmarcRecords[0] || 'None'
        },
        httpHeaders: headersData,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to complete security scan', details: error.message });
  }
}
