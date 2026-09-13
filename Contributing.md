# Contributing to envcheck

First off, thank you for considering contributing to `envcheck`! It's people like you that make open-source tools great.

The primary goal of `envcheck` is to support as many development environments, languages, and tools as possible. If your favorite stack is missing, we would love for you to add it!

## 🧠 The Architecture (It's easier than you think)

`envcheck` is designed specifically to make adding new tools effortless. You do **not** need to touch the core analysis engine, the CLI logic, or the UI formatter.

Everything is centralized in a single file:

```text id="wqk8lz"
src/collectors/registry.ts
```

To add a new tool, you simply add one object to the `collectors` array.

## 🚀 How to Add a New Tool

### Step 1: Fork and Clone

1. Fork the repository on GitHub.
2. Clone your fork locally:

```bash id="2j0q4h"
git clone https://github.com/YOUR-USERNAME/envcheck.git
```

3. Install dependencies:

```bash id="4l8w3k"
npm install
```

### Step 2: Add to the Registry

Open:

```text id="qf5w2n"
src/collectors/registry.ts
```

You will see two helper functions at the top of the file:

* **`extractVersion()`** — Use this for tools installed globally on the system, such as Python, Go, or Redis. It runs a terminal command and extracts the semantic version (for example, `1.2.3`).

* **`getLocalPackageVersion()`** — Use this for local project dependencies, such as Vue, Angular, or Tailwind. It reads directly from the project's `node_modules`.

#### Example A: Adding a Global System Tool

For example, adding support for SQLite:

```typescript id="z9f7k2"
{
  name: 'sqlite',
  displayName: 'SQLite',

  async collect() {
    try {
      // Run the command that prints the version
      return extractVersion(await runCommand('sqlite3 --version'));
    } catch {
      // If the command fails, the tool isn't installed. Return null.
      return null;
    }
  }
}
```

#### Example B: Adding a Local Package

For example, adding support for Vue.js:

```typescript id="r5x3md"
{
  name: 'vue',
  displayName: 'Vue.js',

  async collect() {
    return getLocalPackageVersion('vue');
  }
}
```

### Step 3: Test Your Addition

Before submitting your Pull Request, make sure your new collector actually works!

**1. Build the project:**

```bash id="1s7j6p"
npm run build
```

**2. Link it locally:**

```bash id="j5k9wq"
npm link
```

**3. Create a `.envcheckrc.json` file** in a test directory and require the tool you just added.

**4. Run `envcheck`** to verify that it detects the version correctly.

### Step 4: Submit a Pull Request

Commit your changes:

```bash id="7m2v4x"
git commit -m "feat: added support for SQLite"
```

Push to your fork:

```bash id="8n4c1p"
git push origin main
```

Open a Pull Request on the main repository!

## 🐛 Found a Bug?

If you find a bug in the core engine, such as broken terminal output or JSON parsing failures, please open an **Issue on GitHub** first.

This allows us to discuss the best way to fix the problem before you write any code.

## 📝 Code Style

We use **strict TypeScript**.

Please ensure:

* There are no `any` types.
* There are no TypeScript compiler errors.
* Code follows the existing project structure and conventions.
* New dependencies are avoided whenever possible.

### Keep It Lightweight

`envcheck` must remain **lightweight and fast**.

Please do not add heavy npm packages without discussing them in an Issue first.

The goal is simple:

> **Adding support for a new technology should be easy, while keeping the core tool fast, reliable, and dependency-light.**
