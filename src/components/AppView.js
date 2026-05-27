import { Component } from 'queflow'
import QuestionCard from '../atoms/QuestionCard.js'


// Subject list
const SUBJECTS = ['Mathematics', 'English', 'Chemistry', 'Physics']

const YEARS = Array.from({ length: 2025 - 1978 + 1 }, (_, i) => 1978 + i)

async function loadSubject(subject, year) {
  const module = await import(`https://esm.sh/gh/lahan-xyz/jamb-past-questions/src/scraper/past-questions/${subject.toLowerCase()}.js`);
  return module.default[`year_${year}`] || [];
}

const AppView = new Component("AppView", {
  // Only data that is bound in the template goes here
  data: {
    currentSubject: 'Mathematics',
    currentYear: 2024,
    currentPage: 1,
    totalPages: 6, // will be updated dynamically
    exist: true
  },
  
  created(data) {
    this.isRendered = false;
    // Helper functions stay as plain instance props (no reactivity)
    this.computePageIdxRange = () => {
      const first = (data.currentPage * 10) - 10
      const second = (data.currentPage * 10)
      return [first, second]
    }
    
    this.transformQuestObj = (obj, idxStart) => {
      return obj.map((obj, index) => {
        idxStart += 1
        return { ...obj, quest_no: idxStart, year: data.currentYear }
      })
    }
    
    this.loadAndRender = async () => {
      const questions = await loadSubject(data.currentSubject, data.currentYear)
      const [first, second] = this.computePageIdxRange()
      const sliced = questions.slice(first, second)
      const transformed = this.transformQuestObj(sliced, first)
      // update total pages dynamically
      data.totalPages = Math.ceil(questions.length / 10) || 1
      
      if (this.isRendered) {
        QuestionCard.set(transformed)
      } else {
        QuestionCard.renderWith(transformed);
        this.isRendered = true;
      }
    }
    
    // Page navigation
    this.previousPage = () => {
      if (data.currentPage > 1) {
        data.currentPage -= 1
        this.loadAndRender()
      }
    }
    
    this.nextPage = () => {
      if (data.currentPage < data.totalPages) {
        data.currentPage += 1
        this.loadAndRender()
      }
    }
  },
  
  async run() {
    // Initial load
    await this.loadAndRender()
    // q:show, q:text, q:html, q:once:attr, q:class, q:style
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
  
      /* remove browser default appearance (including Safari) */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
  
      /* custom dropdown arrow */
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
  
      /* ensure width is determined by content + padding, not by default sizing */
      min-width: 18rem;
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