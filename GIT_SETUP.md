# Git Repository Setup Guide

## 📂 Repository Initialization

If starting from scratch, initialize the Git repository with these commands:

### One-Time Setup
```bash
# Initialize git repo
git init

# Add remote origin
git remote add origin https://github.com/richhabits/mandmautoperformance.com.git

# Set main as default branch
git branch -M main

# Stage all files
git add .

# Make initial commit
git commit -m "chore: initialize richhabits performance architecture"

# Push to GitHub
git push -u origin main
```

### If Cloning Existing Repository
```bash
git clone https://github.com/richhabits/mandmautoperformance.com.git
cd mandmautoperformance.com
npm install
```

---

## 🌿 Branch Strategy

### Branch Naming Convention
```
feature/[feature-name]      # New features
fix/[bug-name]              # Bug fixes
docs/[doc-name]             # Documentation
refactor/[component-name]   # Refactoring
chore/[task-name]           # Maintenance & updates
```

### Example Workflow

1. **Create feature branch**:
```bash
git checkout -b feature/ai-concierge-improvements
```

2. **Make changes**:
```bash
# Edit files...
# Test locally (npm run dev)
# Run tests (npm run test)
# Check types (npm run type-check)
# Lint code (npm run lint)
```

3. **Stage and commit** (using Conventional Commits):
```bash
git add .
git commit -m "feat: improve AI concierge response accuracy"
```

4. **Push to GitHub**:
```bash
git push -u origin feature/ai-concierge-improvements
```

5. **Create Pull Request**:
   - Go to https://github.com/richhabits/mandmautoperformance.com
   - Click "Compare & pull request"
   - Add PR title and description
   - Request reviewers
   - Merge when approved

6. **Delete feature branch** (after merge):
```bash
git branch -d feature/ai-concierge-improvements
git push origin --delete feature/ai-concierge-improvements
```

---

## 📝 Commit Message Format

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance, dependency updates
- **ci**: CI/CD configuration changes

### Scope (Optional)
- `booking`: Booking-related changes
- `vehicles`: Fleet/vehicle management
- `ai`: AI Concierge features
- `dashboard`: Dashboard features
- `api`: API endpoints
- `components`: UI components
- `db`: Database changes
- `auth`: Authentication

### Subject
- Use imperative mood ("add feature" not "added feature")
- Don't capitalize first letter
- No period at end
- Max 50 characters

### Examples

**Good**:
```bash
git commit -m "feat(ai): add multi-language support to concierge"
git commit -m "fix(booking): resolve document verification timeout"
git commit -m "docs: update API documentation with new endpoints"
git commit -m "refactor(components): simplify fleet card component"
git commit -m "test(booking): add unit tests for date validation"
```

**Bad**:
```bash
git commit -m "Updated stuff"
git commit -m "Fixed bug"
git commit -m "Changed code"
```

---

## 🔄 Syncing with Main Branch

### Before Creating PR
```bash
# Fetch latest changes from main
git fetch origin

# Rebase your branch onto main
git rebase origin/main

# If conflicts, resolve them then:
git rebase --continue

# Force push your branch (only on personal branches!)
git push -f origin feature/your-feature
```

### After Long Development
```bash
# Ensure you have latest main
git fetch origin

# Rebase onto latest main
git rebase origin/main

# Resolve conflicts if any
# Then push
git push -f origin feature/your-feature
```

---

## 🔐 Security Best Practices

### Never Commit Sensitive Data
❌ Do NOT commit:
- `.env.local` files
- API keys or secrets
- Database credentials
- Private SSH keys
- API tokens

✅ Do use:
- `.env.example` for templates
- Vercel dashboard for secrets
- Environment variables for sensitive data

### Remove Accidentally Committed Secrets
```bash
# If you accidentally committed a secret, immediately:
git reset HEAD~1
# Remove the file from staging
git rm --cached .env.local
# Add to .gitignore
echo ".env.local" >> .gitignore
git add .
git commit -m "chore: remove sensitive .env.local file"
git push origin branch-name
```

---

## 🔍 Reviewing Before Push

### Pre-Commit Checklist
```bash
# 1. Test locally
npm run dev
# (manually test features)

# 2. Run tests
npm run test

# 3. Check types
npm run type-check

# 4. Lint code
npm run lint

# 5. Build for production
npm run build

# 6. Review your changes
git diff

# 7. Check commit message format
git log -1 --pretty=%B
```

---

## 📊 Git Commands Cheat Sheet

```bash
# View commit history
git log --oneline
git log --graph --oneline --all

# View changes
git status
git diff
git diff --cached

# Staging
git add file.tsx
git add .
git reset file.tsx
git reset

# Commits
git commit -m "message"
git commit --amend                    # Edit last commit
git revert HEAD~1                     # Undo specific commit

# Branches
git branch                            # List branches
git branch -a                         # List all (local & remote)
git checkout -b feature/new           # Create & switch branch
git checkout feature/existing         # Switch branch
git branch -d feature/old             # Delete local branch
git push origin --delete feature/old  # Delete remote branch

# Remote
git remote -v                         # List remotes
git fetch origin                      # Fetch latest from remote
git pull origin main                  # Fetch & merge from remote
git push origin feature/branch        # Push to remote

# Stashing
git stash                             # Save uncommitted changes
git stash list                        # List stashed changes
git stash pop                         # Apply & remove from stash
git stash apply                       # Apply without removing
```

---

## 🚨 Troubleshooting

### Merge Conflicts
```bash
# 1. Identify conflicting files
git status

# 2. Open files and resolve conflicts (look for <<<<, ===>, >>>>)
# 3. Stage resolved files
git add resolved-file.tsx

# 4. Complete merge/rebase
git rebase --continue
# or
git merge --continue

# 5. Push
git push origin branch-name
```

### Accidentally Committed to Wrong Branch
```bash
# 1. Reset branch to previous commit
git reset HEAD~1

# 2. Create correct branch
git checkout -b feature/correct-branch

# 3. Commit and push
git add .
git commit -m "feat: correct message"
git push -u origin feature/correct-branch
```

### Need to Undo Last Commit
```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes entirely
git reset --hard HEAD~1

# Push to remote
git push -f origin branch-name
```

---

## 🔗 GitHub PR Workflow

### Creating a Pull Request

1. **Push branch to GitHub**:
```bash
git push -u origin feature/your-feature
```

2. **Go to GitHub**:
   - Navigate to repository
   - Click "Compare & pull request" banner
   - Or: Click "Pull requests" tab → "New pull request"

3. **Fill out PR Template**:
```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No breaking changes

## Screenshots (if applicable)
[Add screenshots if UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No new warnings generated
```

4. **Request Reviewers**:
   - Add team members
   - Assign labels
   - Set milestone (if applicable)

5. **Address Review Comments**:
   - Make requested changes
   - Commit changes: `git commit -m "review: address feedback"`
   - Push: `git push origin feature/your-feature`
   - Don't force push (keeps conversation intact)

6. **Merge When Approved**:
   - Click "Squash and merge" or "Rebase and merge"
   - Delete branch after merge

---

## 🚀 Deployment via Git

### Automatic Deployment (Recommended)
Every push to `main` automatically triggers deployment:

1. Push to `main` branch
2. GitHub Actions runs tests & lint
3. Vercel builds the project
4. Automatic deployment to production
5. Deployment URL appears in GitHub

### Check Deployment Status
1. Go to GitHub repository
2. Click "Deployments" tab
3. View deployment history and logs

### Rollback if Needed
```bash
# Find the commit to rollback to
git log --oneline -n 20

# Revert specific commit
git revert <commit-hash>

# Or reset to previous state
git reset --hard <commit-hash>

# Push to trigger redeploy
git push origin main
```

---

## 📖 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git)

---

**Last Updated**: April 3, 2026
**Repository**: https://github.com/richhabits/mandmautoperformance.com
**Organization**: richhabits
