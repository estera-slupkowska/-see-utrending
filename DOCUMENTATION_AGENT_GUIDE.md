# Documentation Agent Best Practices Guide
*Based on Anthropic's Claude Code Engineering Best Practices*

## Core Principles for Documentation Agents

### 1. **Context-First Approach**
- **Always read existing files first** before making changes
- Use the **Explore-Plan-Code-Commit workflow**:
  1. **Explore**: Read relevant documentation files without modification
  2. **Plan**: Create a clear plan for documentation updates
  3. **Code**: Implement documentation changes
  4. **Commit**: Verify and finalize updates

### 2. **CLAUDE.md Excellence Standards**

#### Essential Sections (in order):
```markdown
# CLAUDE.md

## Project Overview
- Clear, concise project description
- Business purpose and target audience
- Current development phase

## Tech Stack
- Exact versions of all dependencies
- Architecture decisions and reasoning
- Database schema overview

## Common Commands
- Development workflow commands
- Testing and linting commands
- Deployment procedures
- Database operations

## Project Structure
- High-level folder organization
- Key files and their purposes
- Feature organization patterns

## Development Guidelines
- Code style and conventions
- State management patterns
- Component patterns
- Performance considerations

## Environment Variables
- Required environment variables
- Example configurations
- Setup instructions

## Architecture Notes
- Authentication flow
- Real-time features
- API integration patterns
- Security considerations
```

### 3. **Documentation Quality Standards**

#### Actionability
- Every command should be copy-pasteable
- Include exact file paths and examples
- Provide context for when to use each command

#### Accuracy
- Version numbers must match package.json
- File paths must match actual structure
- Examples must reflect current implementation

#### Clarity
- Use consistent terminology
- Explain "why" not just "what"
- Include implementation status (completed vs planned)

### 4. **Agent System Prompt Template**

```markdown
# Documentation Agent v2.0

## Role
You are a specialized documentation agent focused on creating and maintaining high-quality technical documentation following Anthropic's best practices.

## Workflow
1. **Explore Phase**: Read all existing documentation and codebase structure
2. **Plan Phase**: Create detailed update plan based on current implementation
3. **Execute Phase**: Update documentation with accurate, actionable content
4. **Verify Phase**: Cross-check all information against actual code

## Standards
- Prioritize accuracy over completeness
- Use exact version numbers from package.json
- Include only implemented features in main sections
- Mark planned features clearly as "Future Implementation"
- Provide copy-pasteable commands and examples
- Follow semantic versioning for documentation updates

## Quality Checklist
- [ ] All commands tested and verified
- [ ] Version numbers match dependencies
- [ ] File paths match actual structure  
- [ ] Examples reflect current implementation
- [ ] Clear distinction between completed vs planned features
- [ ] Consistent terminology throughout
- [ ] Actionable instructions for developers
```

## 5. **Advanced Documentation Patterns**

### Multi-File Documentation Strategy
```
docs/
├── CLAUDE.md              # Main development guide
├── SETUP.md               # Initial setup instructions  
├── API.md                 # API documentation
├── DEPLOYMENT.md          # Deployment guide
├── CONTRIBUTING.md        # Contribution guidelines
└── TROUBLESHOOTING.md     # Common issues and solutions
```

### Feature-Driven Documentation
```markdown
## Feature Implementation Status

### ✅ Completed Features
- Navigation with language switcher
- Hero section with i18n
- Locked leaderboard component
- Basic UI components (Button, Card)
- Tailwind design system

### 🚧 In Progress
- TikTok OAuth integration
- Contest management system

### 📋 Planned Features
- Real-time leaderboard updates
- Badge system
- Creator profiles
```

### Code Examples Integration
```markdown
## Example Usage

### Creating a New Component
```typescript
// src/components/ui/NewComponent.tsx
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

export function NewComponent() {
  const { t } = useTranslation()
  return (
    <div className="card-clean">
      <h2>{t('component.title')}</h2>
      <Button variant="primary">{t('component.cta')}</Button>
    </div>
  )
}
```

## 6. **Automated Documentation Maintenance**

### Git Hooks Integration
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run docs:update
npm run docs:validate
```

### Documentation Validation Script
```json
{
  "scripts": {
    "docs:update": "claude-code run docs-updater-agent",
    "docs:validate": "npm run type-check && npm run lint",
    "docs:generate": "typedoc && jsdoc"
  }
}
```

## 7. **Documentation Testing Strategy**

### Command Verification
- Test all documented commands in clean environment
- Verify file paths and directory structure
- Validate environment variable requirements

### Content Accuracy
- Cross-reference with package.json versions
- Verify feature implementation status
- Check external dependencies and links

### User Experience Testing
- New developer onboarding simulation
- Documentation-only setup attempts
- Command sequence validation

## Implementation for SeeUTrending

Your documentation agent should:

1. **Always verify current state first**
   - Read package.json for exact versions
   - Check actual folder structure
   - Identify implemented vs planned features

2. **Maintain accuracy over aspirations**
   - Don't document features that aren't built yet
   - Use proper implementation status markers
   - Update as features are completed

3. **Focus on developer experience**
   - Provide exact commands that work
   - Include troubleshooting for common issues
   - Explain architectural decisions

4. **Follow semantic documentation updates**
   - Major: Breaking changes to setup/architecture
   - Minor: New features documented
   - Patch: Corrections and clarifications

This approach ensures your documentation agent creates reliable, accurate, and truly helpful documentation that follows Anthropic's proven best practices.