# Slidish

An AI-powered presentation designer built for high-performance visual storytelling. Create stunning, professional slide decks beyond the horizon in seconds.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **AI Engine**: [TanStack AI](https://tanstack.com/ai) with OpenAI
- **Presentation**: [Reveal.js](https://revealjs.com/), [React Markdown](https://github.com/remarkjs/react-markdown)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Tooling**: [Bun](https://bun.sh/), [Biome](https://biomejs.dev/)

##  Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- OpenAI API Key (configured in `.env`).

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/praashh/slidish.git
   cd slidish
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   OPENAI_API_KEY=your_key_here
   NEXT_PUBLIC_VALID_PASSWORD=your_password
   ```

4. **Run Development Server**
   ```bash
   bun dev
   ```

5. **Build for Production**
   ```bash
   bun run build
   bun start
   ```

##  Contribution

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git checkout push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
Built by [praash](https://x.com/10xpraash)
