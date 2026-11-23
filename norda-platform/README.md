# NorDa — Complete Platform

A standalone platform combining a digital products store, creative portfolio, and professional digital services under one brand, in Arabic (RTL) and English (LTR).

This project is independent. It does not connect to or modify any existing NorDa production website, repository, database, or infrastructure.

## Status

The project is built in reviewable batches. B0 establishes the workspace and shared domain contracts. The application is not runnable end-to-end until the web and API batches are added.

## Prerequisites

- Node.js 20 LTS or newer
- pnpm 9
- PowerShell 5+ on Windows, or Bash with rsync and zip for packaging

## Setup (after all batches land)

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

On Windows PowerShell, copy the environment template with: `Copy-Item .env.example .env`.

## Payment rules

NorDa supports exactly two payment methods: PayPal in USD and BaridiMob (بريدي موب) in DZD through a manual transfer and proof-of-payment workflow. The default reference exchange rate is 1 USD = 250 DZD and is configurable in admin settings.

## Demo boundaries

Demo products, prices, availability, portfolio concepts, and payment flows must be visibly identified as demonstrations. No fabricated customers, testimonials, awards, performance metrics, or provider relationships. Demo payment flows must never imply that a real payment was collected.

## Security

Secrets belong in a local `.env` file and must never be committed or included in the ZIP. The `.env.example` file contains placeholders only. GGSoma credentials remain server-side. Production credentials and existing production databases are not part of this project.

## Packaging

Packaging becomes available after the API and web packages are added. The scripts verify the required project structure and exclude local runtime data, dependencies, and environment secrets.

- Bash: `bash scripts/package.sh` (requires rsync and zip)
- Windows PowerShell: `powershell -ExecutionPolicy Bypass -File scripts/package.ps1`

The archive will be named `NorDa-Complete-Platform.zip`.

## Structure

```
norda-platform/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   └── shared/
├── scripts/
├── .env.example
└── README.md
```

## License

Proprietary — all rights reserved. Not for redistribution.
