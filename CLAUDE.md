# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conversation Guidelines

- 常に日本語で会話する

## Project Overview

PicViewer is a local image management application. The repository is currently in its initial state with only a README.md file.

## Repository Status

This is a minimal repository that has been initialized but does not yet contain source code, build configuration, or development setup. The project is described as "ローカルにある画像を管理するアプリ" (an app for managing local images).

## Current Structure

- `README.md` - Project description in Japanese
- `.claude/settings.local.json` - Claude Code permissions configuration

## Development Setup

### Technology Stack
- Frontend: React + TypeScript + Vite
- Desktop App: Tauri
- Styling: Tailwind CSS
- Data Storage: JSON files in `.picviewer` folders

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run tauri` - Run Tauri commands

### Project Structure
```
PicViewer/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── types/           # TypeScript types
├── src-tauri/           # Tauri backend (Rust)
└── dist/               # Build output
```

### Data Storage
- Tags are stored in `.picviewer/tags.json` files
- Each directory with images gets its own `.picviewer` folder
- No database server required - uses filesystem only

## Notes

The repository has Claude Code permissions configured to allow `find` and `ls` bash commands in `.claude/settings.local.json`.