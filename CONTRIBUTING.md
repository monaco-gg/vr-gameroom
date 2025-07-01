### Contributing Guidelines

---

#### Welcome Contributors!

Thank you for considering contributing to Monaco Gameroom. By contributing to this project, you help us create a better gaming experience for users worldwide.

---

#### How to Contribute

We follow the GitHub Flow for managing our development process. Here's a step-by-step guide to get you started:

1. **Fork the Repository:**

   - Start by forking the repository to your GitHub account. This will create a copy of the project under your account.

2. **Clone the Repository:**

   - Clone the forked repository to your local machine using the following command:
     ```bash
     git clone https://github.com/monaco-gg/monaco-gameroom.git
     cd monaco-gameroom
     ```

3. **Create a Branch:**

   - Before making any changes, create a new branch to work on. Choose a descriptive branch name that reflects the nature of your changes:
     ```bash
     git checkout -b feature/new-feature
     ```

4. **Make Changes:**

   - Make your desired changes to the codebase. Ensure that your changes align with the project's coding conventions and standards.

5. **Commit Changes:**

   - Use `npm run commit` to commit your changes using Commitizen with Gitmoji:
     ```bash
     npm run commit
     ```
     This command will guide you through creating a gitmoji + conventional commit message following the pattern:
     ```
     ✨ feat: add new user login feature
     🐛 fix: resolve issue with user login
     📝 docs: update README with new instructions
     🎨 style: improve code formatting
     ♻️ refactor: restructure authentication logic
     ⚡️ perf: optimize database queries
     ✅ test: add unit tests for login function
     🔧 chore: update dependencies
     ```

6. **Push Changes:**

   - Push your changes to your forked repository on GitHub:
     ```bash
     git push origin feature/new-feature
     ```

7. **Submit a Pull Request (PR):**

   - Go to the GitHub repository and navigate to the branch you recently pushed.
   - Click on "Compare & pull request" to submit your changes for review.

8. **Discuss and Review:**

   - Participate in discussions with maintainers and other contributors about your pull request.
   - Address any feedback or concerns raised during the review process.

9. **Merge Pull Request:**
   - Once approved, a maintainer will merge your changes into the main branch of the repository.

---

#### Types of Branches

When contributing to Monaco Gameroom, consider using the following types of branches:

- **Feature branches:** Used for developing new features or enhancements. Naming convention: `feature/feature-name`.
- **Bug fix branches:** Used for fixing bugs found in the main branch. Naming convention: `bugfix/issue-number`.
- **Hotfix branches:** Used for quickly addressing critical issues in production. Naming convention: `hotfix/issue-number`.
- **Release branches:** Used for preparing the next release version. Naming convention: `release/version-number`.
- **Documentation branches:** Used for updating or enhancing documentation. Naming convention: `docs/document-topic`.

---

#### Release Process

We use `semantic-release` to automate the release process. Here's how it works:

1. **Ensure Commit Messages Follow Convention:**

   - Make sure all commit messages follow the Conventional Commits specification. This allows `semantic-release` to determine the type of changes in the codebase and the next version number.

   Examples:

   - `✨ feat: add new user login feature`
   - `🐛 fix: resolve issue with user login`
   - `📝 docs: update API documentation`
   - `🎨 style: improve component styling`
   - `♻️ refactor: restructure authentication logic`
   - `⚡️ perf: optimize database queries`
   - `✅ test: add unit tests for login function`
   - `🔧 chore: update dependencies`

2. **Merging Pull Requests:**

   - When your pull request is reviewed and approved, a maintainer will merge it into the `main` branch. Make sure the commits in your PR follow the Conventional Commits specification.

3. **Automated Release:**

   - Once changes are merged into the `main` branch, `semantic-release` will automatically:
     - Analyze commits to determine the type of release (patch, minor, major).
     - Update the version in `package.json`.
     - Generate or update the `CHANGELOG.md` file.
     - Commit these changes.
     - Create a new Git tag for the release.
     - Publish the package to the configured registry (e.g., npm).

4. **Manual Trigger:**

   - In some cases, you might need to manually trigger a release. This can be done by running:
     ```bash
     npx semantic-release
     ```

   Note: This step usually occurs automatically in a CI/CD pipeline after merging to `main`.

By following these guidelines and ensuring your commit messages are properly formatted, you help maintain a smooth and automated release process.

---

Thank you for your contributions and helping us improve Monaco Gameroom!

---
