# Cyber Nexus Portfolio

A high-performance, security-themed portfolio website built with vanilla HTML, CSS, and JavaScript. This project was recently refactored from a React application to a lightweight, framework-free architecture.

## 🚀 Live Demo

[https://vigabanc.github.io/portfolio/](https://vigabanc.github.io/portfolio/)

## 📂 Project Structure

The project follows a clean, asset-based structure:

```
portfolio/
├── assets/
│   ├── css/          # Stylesheets (styles.css)
│   ├── data/         # Dynamic content configuration (data.json)
│   ├── images/       # Static image assets
│   └── js/           # Application logic (script.js)
├── cv final.pdf      # Downloadable CV
├── index.html        # Main entry point
└── README.md         # Project documentation
```

## 🛠️ Customization

Content is dynamically loaded from `assets/data/data.json`. You can update your portfolio without touching the HTML code.

### Updating Profile & Skills

1. Open `assets/data/data.json`.
2. Edit the `profile` object to change your name, role, and bio.
3. Modify the `skills` array to add or update your technical skills.

### updates Projects

Add new projects to the `projects` array in `data.json`:

```json
{
  "title": "New Project",
  "description": "Project description...",
  "tags": ["Tag1", "Tag2"],
  "image": "assets/images/project-image.png",
  "links": { "code": "#", "demo": "#" }
}
```

## 🔧 Features

- **Interactive Terminal**: Fully functional terminal with command history and specific commands (`help`, `whoami`, `games`, `clear`).
- **Matrix Rain Effect**: Canvas-based animated background.
- **Dynamic Content**: JSON-driven UI rendering.
- **Responsive Design**: Optimized for mobile and desktop screens.
- **Cyberpunk Aesthetic**: Glitch effects, neon glows, and scanning animations.

## 📦 Deployment

This project is ready for GitHub Pages. Simply push the `main` branch to your repository, and enable GitHub Pages in Settings > Pages (Source: `root` or `/`).

## 📄 License

MIT License - feel free to use this template for your own portfolio!
