# SatoshiShield (Aegis x402) — Web3 & Domain Security Scanner

Open-source security scanner for **EVM Smart Contracts** (Base, Ethereum, Arbitrum, BNB) and **Web Domains** (SPF, DMARC, HTTP Security Headers), with native **HTTP 402 (x402)** micropayment support on Base Mainnet.

## Features
- **Smart Contract Telemetry:** Real-time honeypot, mintable supply, ownership, and buy/sell tax detection powered by GoPlus & DexScreener APIs.
- **Domain & Anti-Phishing Scanner:** Zero-database passive audit of SPF, DMARC, HSTS, and X-Frame-Options via DNS-over-HTTPS.
- **x402 AI Agent API (`/api/x402-audit`):** Native HTTP 402 Payment Required handshake for autonomous AI agents paying in Base USDC.
- **Zero-Cost Deployment:** Runs 100% free on Vercel Serverless Functions with zero database dependencies and zero gas required to deploy.

## 1-Click Deployment on Vercel
1. Upload this repository to GitHub.
2. Import into [Vercel](https://vercel.com/new).
3. Click **Deploy** (No environment variables or paid API keys required!).

## Builder & Funding
- **Author:** Alejandro González Ortiz ([Ecos de Satoshi](https://ecosdesatoshi.com))
- **EVM / Base Address:** `0x9e041bcb426026bd055ff590e63416b5d8271616`
