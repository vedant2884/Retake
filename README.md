# RETAKE

> A Valorant challenge tracker that turns agent-based challenges into a simple, replayable experience.

Retake is a local-first Valorant challenge web app built to make challenge runs more fun and trackable.

Pick a challenge, get a random agent from the available pool, play your match, and record the result. Winning retires the selected agent from the current run, while losing keeps them in the pool.

---

## Features

- 🎯 **Random Agent Selection**
  - Animated agent selector
  - Randomly selects from the active agent pool
  - Visual highlight animation while selecting

- 🏆 **Challenge Runs**
  - Start a fresh challenge run
  - Track available and completed agents
  - Win/loss based progression

- 🔄 **Reset Challenges**
  - Reset the current challenge at any time
  - Clears the current run and starts fresh

- 📊 **Progress Tracking**
  - Track challenge results
  - Completed agents are removed from the active pool after a win
  - Lost agents remain available for another attempt

- 🎨 **Valorant-Inspired UI**
  - Dark graphite interface
  - Signal/accent styling
  - Agent portraits
  - Animated interactions

- 🧩 **Custom Challenges**
  - Support for custom challenge types
  - Flexible challenge configuration

- 💾 **Local Data Storage**
  - Challenge progress is stored locally
  - No external database required for development

---

## How It Works

### 1. Choose a Challenge

Select one of the available challenges from the challenge dashboard.

### 2. Start the Selection

Click **Initiate Selection**.

Retake displays the available Valorant agents and runs an animated selection sequence.

### 3. Play the Match

The selected agent becomes your agent for the challenge.

Go play the match in Valorant.

### 4. Report the Result

After the match:

- **Won** → The agent is retired from the current challenge run.
- **Lost** → The agent remains in the pool.

### 5. Continue

Keep playing until you've completed the challenge or decide to reset the run.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | Web application framework |
| React | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| SQLite | Local data persistence |
| Lucide React | UI icons |

---

## Project Structure

```text
Retake/
├── app/
│   ├── (site)/
│   │   ├── challenges/
│   │   └── ...
│   └── ...
│
├── components/
│   ├── selector/
│   ├── ui/
│   └── ...
│
├── lib/
│   ├── actions/
│   ├── agents.ts
│   ├── challenges.ts
│   ├── challenges-repo.ts
│   ├── custom-challenges-repo.ts
│   └── ...
│
├── public/
│   └── agents/
│       ├── jett.png
│       ├── sage.png
│       ├── harbour.png
│       └── ...
│
├── types/
├── package.json
├── tailwind.config.ts
└── README.md
