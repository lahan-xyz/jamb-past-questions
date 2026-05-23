import { Component } from 'queflow'
import QuestionCard from '../atoms/QuestionCard.js'

// Subject list – you can import from your data files later
const SUBJECTS = ['Mathematics', 'English', 'Chemistry', 'Physics']

const YEARS = Array.from({ length: 2025 - 1978 + 1 }, (_, i) => 1978 + i)

async function loadSubject(subject, year) {
  const module = await import(`../scraper/past-questions/${subject.toLowerCase()}.js`);
  return module.default[`year_${year}`] || [];
}

const AppView = new Component("AppView", {
  // Only data that is bound in the template goes here
  data: {
    currentSubject: 'Mathematics',
    currentYear: 2024,
    currentPage: 1,
    totalPages: 6, // will be updated dynamically
  },
  
  created() {
    this.isRendered = false;
    // Helper functions stay as plain instance props (no reactivity)
    this.computePageIdxRange = () => {
      const first = (this.data.currentPage * 10) - 10
      const second = (this.data.currentPage * 10)
      return [first, second]
    }
    
    this.transformQuestObj = (obj, idxStart) => {
      return obj.map((obj, index) => {
        idxStart += 1
        return { ...obj, quest_no: idxStart, year: this.data.currentYear }
      })
    }
    
    this.loadAndRender = async () => {
      const questions = await loadSubject(this.data.currentSubject, this.data.currentYear)
      const [first, second] = this.computePageIdxRange()
      const sliced = questions.slice(first, second)
      const transformed = this.transformQuestObj(sliced, first)
      // update total pages dynamically
      this.data.totalPages = Math.ceil(questions.length / 10) || 1
      
      if (this.isRendered) {
        QuestionCard.set(transformed)
      } else {
        QuestionCard.renderWith(transformed);
        this.isRendered = true;
      }
    }
    
    // Page navigation
    this.previousPage = () => {
      if (this.data.currentPage > 1) {
        this.data.currentPage -= 1
        this.loadAndRender()
      }
    }
    
    this.nextPage = () => {
      if (this.data.currentPage < this.data.totalPages) {
        this.data.currentPage += 1
        this.loadAndRender()
      }
    }
  },
  
  async run() {
    // Initial load
    await this.loadAndRender()
  },
  
  template: (data) => `
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">JAMB Past Questions</h1>
        <div class="app-controls">
          <select class="app-select" onchange={{ data.currentSubject = e.target.value; this.loadAndRender() }}>
            ${SUBJECTS.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
          </select>
          <select class="app-select" onchange={{ data.currentYear = parseInt(e.target.value); this.loadAndRender() }}>
            ${YEARS.map(year => `<option value="${year}" ${ year === data.currentYear ? 'selected' : '' }>${year}</option>`).join('')}
          </select>
          <div class="page-nav">
            <button class="page-btn" onclick={{ this.previousPage() }}>← Prev</button>
            <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
            <button class="page-btn" onclick={{ this.nextPage() }}>Next →</button>
          </div>
        </div>
      </header>
      <main id="questions-container"></main>
    </div>
  `,
  
  stylesheet: {
    ".app-container": `
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.2rem;
    `,
    ".app-header": `
      text-align: center;
      margin-bottom: 2rem;
    `,
    ".app-title": `
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      background: linear-gradient(to right, #4ade80, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    `,
    ".app-controls": `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.8rem;
      align-items: center;
    `,
    ".app-select": `
      background: #1a1a24;
      border: 1px solid #2e2e3e;
      border-radius: 30px;
      padding: 0.6rem 1.4rem;
      color: #ccc;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,..."); /* optional arrow */
    `,
    ".app-select:hover, .app-select:focus": `
      border-color: #4ade80;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
    `,
    ".page-nav": `
      display: flex;
      align-items: center;
      gap: 0.6rem;
    `,
    ".page-btn": `
      all: unset;
      background: #1a1a24;
      border: 1px solid #2e2e3e;
      border-radius: 30px;
      padding: 0.6rem 1.2rem;
      color: #ccc;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, transform 0.1s;
    `,
    ".page-btn:hover": `
      background: #252535;
      color: #fff;
      transform: translateY(-1px);
    `,
    ".page-btn:active": `
      transform: scale(0.96);
    `,
    ".page-indicator": `
      font-size: 0.9rem;
      font-weight: 500;
      color: #888;
      min-width: 3rem;
      text-align: center;
    `,
    "#questions-container": `
      margin-top: 1rem;
    `,
    // Responsive
    "@media (max-width: 600px)": `
      .app-title {
        font-size: 1.8rem;
      }
      .app-controls {
        flex-direction: column;
        align-items: stretch;
      }
      .page-nav {
        justify-content: center;
      }
    `,
  },
})

export default AppView