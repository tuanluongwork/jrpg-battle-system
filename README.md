# JRPG Battle System

## 🎮 Live Demo
[Play the demo](https://tuanluongwork.github.io/jrpg-battle-system/) - **Playable web demo available!**

To enable the demo on GitHub Pages:
1. Go to Settings → Pages in your repository
2. Set Source: Deploy from a branch, Branch: main, Folder: /docs
3. Save and wait 2-3 minutes for deployment

## 🚀 Features

### Core Gameplay
- **Turn-based Battle System**: Classic JRPG combat mechanics with state management
- **Character System**: Multiple characters with unique stats and abilities
- **Skill System**: Various skills with different effects and animations
- **Equipment System**: Weapons and armor that affect character stats
- **Inventory Management**: Item usage during battles

### Technical Highlights
- Built with **Cocos Creator 3.8** and **TypeScript**
- Custom shader effects for skill animations
- Responsive UI that works on both mobile and web
- Modular architecture using NLibrary data structures
- Comprehensive Git workflow with feature branches

## 🛠️ Tech Stack
- **Engine**: Cocos Creator 3.8
- **Language**: TypeScript
- **Version Control**: Git
- **Deployment**: Web (HTML5) and Mobile (iOS/Android)

## 📋 Requirements
- Cocos Creator 3.8+
- Node.js 14+
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/jrpg-battle-system.git
cd jrpg-battle-system
```

2. Open the project in Cocos Creator

3. Install dependencies:
```bash
npm install
```

4. Run the project in Cocos Creator or build for your target platform

## 🏗️ Project Structure
```
├── assets/
│   ├── scripts/
│   │   ├── battle/          # Battle system logic
│   │   ├── characters/      # Character classes and stats
│   │   ├── skills/          # Skill implementations
│   │   ├── ui/              # UI components
│   │   └── utils/           # Utility classes and NLibrary
│   ├── prefabs/             # Reusable game objects
│   ├── animations/          # Character and effect animations
│   ├── shaders/             # Custom shader effects
│   └── scenes/              # Game scenes
├── settings/                # Cocos Creator project settings
└── package.json
```

## 🎯 Key Components

### Battle State Machine
Manages battle flow with states: Start → Player Turn → Enemy Turn → Victory/Defeat

### Character System
- Base stats: HP, MP, Attack, Defense, Speed
- Equipment slots: Weapon, Armor, Accessory
- Level progression system

### Skill System
- Physical attacks with damage calculation
- Magic spells with particle effects
- Support skills (healing, buffs)
- Custom shader effects for special attacks

## 🚀 Deployment

### Web Build
```bash
# Build for web
npm run build:web
```

### Mobile Build
Configure platform settings in Cocos Creator and build for iOS/Android

## 🤝 Contributing
Feel free to fork and submit pull requests!

## 📝 License
MIT License

## 👤 Author
Tuan Luong - Senior Software Engineer
- GitHub: [@tuanluongwork](https://github.com/tuanluongwork)
- LinkedIn: [Tuan Luong](https://linkedin.com/in/tuanluong) 
