# Photo Gallery & Portfolio

A professional photo gallery and portfolio application built with Next.js 15, TypeScript, and Tailwind CSS. This project is designed for **demoing GitHub Copilot features** in a real-world, component-driven Next.js application. The included demos showcase how Copilot can assist with code generation, refactoring, UI building, and more.

## Demos

- All demo guides and examples are in the [`demos/`](demos/) folder.
- For more information about each demo, refer to the [README](demos/README.md) file in the `demos/` directory.
- To get started, check out the first demo [`features-demo.md`](demos/features-demo.md) for a walkthrough of gallery features and Copilot capabilities.

### Demo Tracks

Latest recommended guides (Option 2):

- [Features Demo (Option 2)](demos/features-demo-option-2.md)
- [Engineering Practices Demo (Option 2)](demos/engineering-practices-option-2.md)
- [Customize Copilot Demo (Option 2)](demos/customize-copilot-option-2.md)
- [Cloud Agent Demo (Option 2)](demos/cloud-agent-option-2.md)

Original guides:

- [Features Demo](demos/features-demo.md)
- [Engineering Practices Demo](demos/engineering-practices.md)
- [Customize Copilot Demo](demos/customize-copilot.md)
- [Copilot Spaces Demo](demos/copilot-spaces.md)
- [Cloud Agent Demo](demos/cloud-agent.md)

### Creating a New Demo

If you want to contribute and create a new demo, follow these steps:

1. Open GitHub Copilot Chat.
2. Type the prompt `/create-copilot-demo` with an explanation of your demo idea.
3. Copilot will generate a new demo file in the `demos/` directory.
4. Fill in remaining sections with detailed instructions, examples, and expected results.

After finishing the demo, don't forget this quick follow-up:

1. Add in the overview, key skills, and demo link to the [demo README](demos/README.md)

## Getting Started

### Technical Requirements

- **Node.js** v18 or newer
- **npm** (or yarn, pnpm, bun)

### Quick Start with GitHub Codespaces

The fastest way to get started is using GitHub Codespaces:

1. Click the **"Code"** button on the GitHub repository page
2. Select the **"Codespaces"** tab
3. Click **"Create codespace on main"** (or your current branch)
4. Wait for the codespace to build and start

The codespace will automatically:
- Install all dependencies (`npm install`)
- Start the development server (`npm run dev`)
- Configure GitHub Copilot and essential VS Code extensions
- Forward port 3000 for the Next.js application

Once ready, you can access the application at the forwarded port URL provided in the terminal.

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ps-copilot-sandbox/copilot-intermediate-gallery-repo.git
   cd gallery-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Theme

The application always uses a light theme, including when the operating system
prefers dark mode. Shared styles and components use light backgrounds with
readable foreground colors, and native form controls inherit `color-scheme: light`.
There is no automatic dark-mode switch or theme toggle.

Run `npm run test:theme` to check the light-theme policy and shared color contrast.

## Agentic Issue Labeling

The separate [Issue area labeler](.github/workflows/issue-area-labeler.md) runs
when an issue is opened. It adds any applicable combination of `Frontend` (UI),
`Backend` (server/API), and `Data` (an explicitly mentioned database change).
Each label is added at most once, existing labels are preserved, and issues with
no clear match are left unchanged. It does not replace other labeling workflows.

Before the first run:

1. Enable GitHub Actions and ensure the repository labels `Frontend`, `Backend`,
   and `Data` exist. Create missing labels in the repository's Labels page.
2. Add the Actions repository secret `COPILOT_GITHUB_TOKEN`: a fine-grained PAT
   owned by an account with an active Copilot license, with the account permission
   **Copilot Requests: Read**. A local GitHub CLI login is not sufficient.
3. Commit the Markdown workflow, its generated `issue-area-labeler.lock.yml`,
   and the compiler-generated `.github/aw/actions-lock.json` and `.gitattributes`
   to the default branch. The issue-opened trigger only runs from that branch.

The agent can only read issues in the current repository. Its read policy
explicitly permits untrusted content so newly opened issues from outside
contributors can be classified, and the prompt treats issue text as data rather
than instructions. A separate safe-output job can add only the three allowed
labels to the triggering issue. Each eligible issue can consume Copilot usage.
The workflow does not run on edits, reopened issues, or label changes. Maintainers
can correct classifications manually.

After changing the workflow, regenerate its lock file using the GitHub CLI's
`gh aw` extension (initially compiled with v0.86.2):

```shell
gh aw compile issue-area-labeler
```

For a manual smoke test after setup, open issues describing UI-only, API-only,
database-only, combined, and unrelated changes. Expect `Frontend`, `Backend`,
`Data`, the matching combination, and no new label, respectively.

## Project Structure

```bash
src/
├── app/                 # Next.js 15 App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and helpers
demos/                   # Demo guides and templates
```