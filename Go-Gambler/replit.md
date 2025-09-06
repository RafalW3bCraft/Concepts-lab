# GO-GAMBLER - 3D Casino Simulation

## Overview

GO-GAMBLER is a comprehensive 3D casino simulation application built with React Three Fiber and TypeScript. The application provides an immersive casino experience featuring three classic games: slot machines, blackjack, and roulette. The system combines 3D graphics with robust game logic to deliver an authentic casino experience while maintaining proper credit management and persistent progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application follows a component-based React architecture with TypeScript, utilizing React Three Fiber for 3D rendering capabilities. The frontend is structured into several key layers:

**Component Architecture**: The system uses a modular component structure with separate 2D and 3D implementations for each game. This dual approach ensures compatibility across different devices while providing enhanced visual experiences where supported.

**State Management**: Zustand is employed for global state management, with separate stores for each game type (slots, blackjack, roulette), casino management, and audio controls. This approach provides clean separation of concerns and efficient state updates.

**3D Rendering Pipeline**: React Three Fiber handles 3D scene management with proper lighting, materials, and animations. The system includes fallback mechanisms to ensure functionality even when 3D features encounter issues.

**UI Framework**: The application uses Radix UI components with Tailwind CSS for styling, providing a consistent and accessible user interface that works across different screen sizes.

### Game Logic Implementation

Each casino game implements its own dedicated logic system:

**Slot Machine Logic**: Features weighted symbol generation, multiple payline calculations, and configurable payout multipliers. The system uses proper randomization algorithms to ensure fair gameplay.

**Blackjack Logic**: Implements complete card deck management, proper hand value calculations including ace handling, and all standard blackjack rules including doubling down and dealer logic.

**Roulette Logic**: Features European-style roulette with comprehensive betting options, wheel physics simulation, and accurate payout calculations for various bet types.

### Data Persistence

The application uses browser localStorage for client-side persistence of user progress, credits, and game statistics. The system includes proper error handling and fallback mechanisms for cases where localStorage is unavailable.

### Audio System

A centralized audio management system handles background music and sound effects with proper volume controls and mute functionality. The system gracefully handles audio loading failures and provides user controls for audio preferences.

### Error Handling and Recovery

The application implements comprehensive error boundaries and fallback mechanisms to ensure stability. Loading states and error recovery systems maintain user experience even when individual components encounter issues.

## External Dependencies

### Core React Ecosystem
- **React 18**: Core framework for component-based UI development
- **React Three Fiber**: 3D rendering engine built on Three.js for immersive graphics
- **@react-three/drei**: Helper components and utilities for React Three Fiber scenes
- **@react-three/postprocessing**: Advanced visual effects and rendering enhancements

### State Management and Data Handling
- **Zustand**: Lightweight state management with subscription capabilities
- **@tanstack/react-query**: Server state management and caching (prepared for future backend integration)

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **@radix-ui/react-***: Comprehensive collection of accessible UI primitives
- **Lucide React**: Modern icon library for consistent iconography
- **@fontsource/inter**: Professional typography with Inter font family

### Development and Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Type safety and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for production builds

### Database Integration (Prepared)
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **Zod**: Runtime type validation for data schemas

### Backend Infrastructure
- **Express.js**: Web application framework for API endpoints
- **Connect-pg-simple**: PostgreSQL session store for user authentication
- **CORS**: Cross-origin resource sharing configuration

### Audio and Media Support
- **Vite-plugin-glsl**: GLSL shader support for advanced 3D effects
- **Custom audio handling**: Browser-native Audio API integration for casino sounds

The architecture is designed to support future enhancements including user authentication, multiplayer features, and advanced 3D effects while maintaining current functionality and performance.