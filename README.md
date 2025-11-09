# 🎯 ATS-Friendly Resume Builder

A professional, ATS-optimized resume builder designed for Canadian job market standards. Create beautiful, parser-friendly resumes without any coding knowledge.

![Resume Builder Preview](https://via.placeholder.com/800x400/2563eb/ffffff?text=ATS+Resume+Builder)

## ✨ Features

- ✅ **ATS-Friendly** - Optimized for Applicant Tracking Systems
- 🇨🇦 **Canadian Format** - Follows Canadian resume standards
- 🎨 **Multiple Font Styles** - Calibri, Calibri Light, Bold, and Italic support
- 📸 **Optional Photo** - Add or remove professional photo
- 🔗 **Clickable Links** - LinkedIn, portfolio, and certification URLs
- 📄 **Instant PDF Download** - Generate and download PDF resumes
- 💅 **Beautiful UI/UX** - Modern, intuitive interface
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Live Demo

Visit: [https://yourusername.github.io/ats-resume-builder](https://yourusername.github.io/ats-resume-builder)

## 📋 Sections Supported

- Personal Information (with optional photo)
- Professional Summary
- Work Experience
- Education
- Skills (organized by categories)
- Certifications (with clickable credential links)
- Languages

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ats-resume-builder.git
cd ats-resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deployment to GitHub Pages

1. Update `homepage` in `package.json` with your GitHub username:
```json
"homepage": "https://yourusername.github.io/ats-resume-builder"
```

2. Deploy:
```bash
npm run deploy
```

## 🎨 Customization

The resume uses professional styling optimized for ATS systems:
- **Font**: Calibri (with Light, Regular, Bold, and Italic variants)
- **Font Size**: 11pt body, larger for headings
- **Line Height**: 1.3 for optimal readability
- **Colors**: Professional blues and grays
- **Layout**: Clean, section-based structure

## 📱 Usage Guide

1. **Personal Info**: Fill in your contact details and optional photo
2. **Experience**: Add work history with bullet points
3. **Education**: Include degrees and institutions
4. **Skills**: Organize skills by category
5. **Other**: Add certifications and languages
6. **Download**: Click "Download PDF" to get your resume

## 🔒 Privacy

All data is stored locally in your browser. Nothing is sent to any server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Icons by Lucide React
- PDF generation using jsPDF and html2canvas

---

⭐ If you find this helpful, please give it a star on GitHub!
```

### **6. `.gitignore`**
```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### **7. `LICENSE`**
```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.