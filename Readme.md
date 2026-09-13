# envcheck

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> The ultimate **"Works on my machine" detector** for modern software teams.

**envcheck** is a zero-config, ultra-fast CLI tool that detects configuration drift between a developer's local environment and the project's expected environment. It validates global runtimes, databases, package managers, and local project dependencies against a single, unified contract.

##  The Problem

Configuration drift is one of the most common causes of broken builds and API failures.

Developer A is running Node 18 and PostgreSQL 14, while Developer B is running Node 22 and PostgreSQL 17.

**envcheck** ensures that before a developer commits code or starts a server, their machine matches the exact specifications required by the project.

##  Quick Start

You can run `envcheck` instantly in any project directory without installing it globally:

```bash
npx envcheck
```

##  Configuration

`envcheck` uses a cascading configuration system. It requires **zero setup** to get started, but scales to support complex full-stack environments.

### 1. Zero-Config (`package.json`)

By default, `envcheck` automatically reads the `engines` field from your existing `package.json`.

For example:

```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

Running:

```bash
npx envcheck
```

will instantly validate your Node.js and npm versions.

### 2. Environment Contract (`.envcheckrc.json`)

For full-stack validation, create an `.envcheckrc.json` file in your project root.

This allows you to validate databases, system tools, and local libraries. Values defined here override values from `package.json`.

```json
{
  "node": ">=20.0.0",
  "pnpm": ">=9.0.0",
  "postgres": ">=15.0.0",
  "docker": ">=24.0.0",
  "react": ">=18.2.0",
  "typescript": ">=5.0.0"
}
```

##  Output Example

`envcheck` provides beautifully formatted, highly readable terminal output:

```text
🔍 Environment Scan Complete

✅ Node.js
   Found: 22.3.0 (Required: >=20.0.0)

✅ npm
   Found: 10.8.1 (Required: >=10.0.0)

❌ PostgreSQL
   Required: >=17.0.0
   Found:    15.2.0
   ↳ Please upgrade your local database to match production.

✅ React
   Found: 18.2.0 (Required: >=18.0.0)

⚠️ Environment drift detected. Please fix the issues above.
```

##  Supported Tech Stack — Tier 1

`envcheck` natively understands how to check versions for the following **30+ tools** out of the box:

| Category             | Supported Tools                                              |
| -------------------- | ------------------------------------------------------------ |
| **Runtimes**         | Node.js, Python, Java, Go, Rust, .NET                        |
| **Package Managers** | npm, pnpm, Yarn, pip, uv, Poetry, Maven, Gradle, Cargo       |
| **Databases**        | PostgreSQL, MySQL, MongoDB, Redis                            |
| **Dev Tools**        | Git, Docker, Docker Compose, curl, OpenSSL                   |
| **Local Libraries**  | TypeScript, React, Next.js, Express, NestJS, Prisma, Drizzle |

##  Contributing

### We want your tech stack!

`envcheck` is designed with a highly modular, plugin-based architecture.

Adding a new language, database, or tool should require only a small, focused contribution to the tool registry.

If you want to add support for a tool that isn't listed above, please read the **Contributing Guide** to learn how easy it is to submit a Pull Request.

---

**Built for developers who are tired of hearing: *"But it works on my machine."***
