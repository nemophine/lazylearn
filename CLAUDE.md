# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LazyLearn is an educational platform built with Next.js 16, React 19, and TypeScript, designed for users who have trouble focusing. The app features a desktop-style interface with a sidebar navigation and multiple learning modules including focus mode, community features, games, and educational content.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (opens at http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### File Structure
- Use `app/` directory for Next.js App Router pages and components
- Use `components/` for reusable React components
- Use `contexts/` for React Context providers
- Use `api/` for Next.js API routes

## Architecture Overview

### Key Components
1. **Main Layout (`app/layout.tsx`)**: Root layout with FocusModeProvider and navigation
2. **Desktop Interface (`app/page.tsx`)**: Main page with sidebar navigation and content area
3. **Focus Mode System**:
   - Context: `app/contexts/FocusModeContext.tsx`
   - Focus pages: `app/focus/` directory with setup, active timer, and summary states
4. **Navigation**: `app/components/DesktopSidebar.tsx` handles all page routing

### Page System
The app uses a client-side routing system with the following main pages:
- **Core**: Home, Focus Mode, Profile, Missions, Rewards
- **Learning**: Video Lessons, Games & Quiz, Search, Line Teacher
- **Community**: Community forum, Cartoon Corner
- **Other**: Analysis, Certificates, Schedule, Support

### State Management
- React Context for global focus mode state
- Local useState for page navigation and component state
- No external state management library currently used

## Development Guidelines for Beginners

### Code Style
- This project uses TypeScript with strict mode enabled
- Components use `'use client'` directive when using React hooks
- Tailwind CSS for styling with custom CSS variables for colors
- Lucide React for icons

### Collaboration Approach
- This is a collaborative project between friends working together
- **Always plan features together before implementation**
- **Only work on features that have been explicitly planned and approved**
- **Never make random changes to the code without being asked**
- Focus on one feature at a time from start to completion
- Follow the planning → development → testing → documentation flow
- Friends may be working on different parts simultaneously
- Coordinate with team members to avoid conflicts
- Test changes thoroughly before committing

### Focus Feature Development
- **Focus Mode development is a collaboration between you and Claude**
- Plan the focus feature together step by step
- Implement systematically with clear phases
- Test each component before moving to the next
- Document changes as we go

### Bilingual Support (การสนับสนุนสองภาษา)
- **Thai explanations available** for complex technical concepts
- Always ask if you need Thai explanation (ถ้าอธิบายอังกฤษไม่เข้าใจ ขอให้อธิบายภาษาไทยได้เลย)
- **Concept verification** - Claude will double-check understanding and correct misconceptions
- If something seems confusing, ask for clarification in both languages

### Focus Mode Feature
The focus mode is a core feature that helps users concentrate. When active:
- Community features are disabled
- UI is simplified to reduce distractions
- Timer functionality helps track focus sessions

### Community Features
Located in `app/community/` with forum and club features. These are designed to be engaging but distracting during focus mode.

### API Routes
API endpoints are in `app/api/` and handle:
- Impact tracking and heart points
- Award generation
- Community forum actions

## Important Notes

1. **Path Aliases**: Use `@/` prefix for imports (configured in `tsconfig.json`)
2. **Component Organization**: Page components are in `app/components/pages/`
3. **UI Components**: Reusable UI components are in `app/components/ui/`
4. **Responsive Design**: Currently optimized for desktop interface
5. **Focus Mode Integration**: Many components check focus mode state to adjust behavior

## Testing and Quality

- ESLint is configured for code quality
- No test framework is currently set up
- Use TypeScript for type safety

## UI/UX Review Requirements

**ALWAYS REVIEW UI, UX, AND USAGE AFTER EVERY CHANGE**

Before committing any changes, Claude must:
1. **Test the functionality thoroughly** - Click buttons, interact with components, verify they work as expected
2. **Check visual appearance** - Ensure colors, sizing, positioning, and styling look correct
3. **Verify user experience** - Test actual user workflows and interactions
4. **Check for visual bugs** - Look for white elements that should be colored, misaligned components, broken layouts
5. **Test responsive behavior** - Ensure components adapt properly to different states
6. **Verify accessibility** - Check that interactive elements are properly styled and usable

### Critical UI Elements to Check:
- **Colors**: No white elements where colored ones should be (thumbs, buttons, etc.)
- **Positioning**: Elements should be properly aligned and positioned
- **Interactions**: Click handlers, hover states, and transitions should work
- **State Updates**: Visual feedback should match component state
- **Progress Indicators**: Thumbs, bars, and timers should move/update correctly

### Common Issues to Watch For:
- White/missing colors on interactive elements
- Frozen or non-updating progress indicators
- Misaligned or positioned elements
- Broken hover states and transitions
- Elements that don't respond to user interaction

**Never commit changes without thorough UI/UX testing**

## Development Tips

- When adding new pages, update the `DesktopSidebar.tsx` navigation
- For features that should be disabled during focus mode, use the `useFocusMode()` hook
- Follow the existing component structure and naming conventions
- Use Tailwind CSS classes consistent with the existing design system