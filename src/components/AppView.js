import { Component } from 'queflow'
import QuestionCard from '../atoms/QuestionCard.js'
//import ENGLISH from '../scraper/past-questions/english.js'

async function loadSubject(subject, year) {
  const module = await import(`../scraper/past-questions/${subject.toLowerCase()}.js`);
  
  return module.default[year];
}


const AppView = new Component("AppView", {
  created() {
    this.currentPage = 1
    this.currentSubject = "Mathematics"
    this.currentYear = 2024
    
    this.computePageIdxRange = () => {
      const firstIndex = (this.currentPage * 10) - 10
      const secondIndex = (this.currentPage * 10)
      
      return [firstIndex, secondIndex]
    }
    
    this.transformQuestObj = (obj, idx) => {
      return obj.map((obj, index) => {
        idx += 1
        return { ...obj, quest_no: idx, year: this.currentYear }
      })
    }
    
    this.updatePage = async function() {
      const obj = await loadSubject(this.currentSubject, `year_${this.currentYear}`)
      const [firstIndex, secondIndex] = this.computePageIdxRange()
      
      const updatedObj = this.transformQuestObj(obj.slice(firstIndex, secondIndex), firstIndex)
      QuestionCard.set(updatedObj)
    }
    
    this.previousPage = () => {
      const currentPage = this.currentPage
      this.currentPage = currentPage === 1 ? 1 : currentPage - 1
      
      this.updatePage()
    }
    
    this.nextPage = () => {
      const currentPage = this.currentPage
      this.currentPage = currentPage === 6 ? 6 : currentPage + 1
      
      this.updatePage()
    }
  },
  
  async run() {
    const loaded = await loadSubject(this.currentSubject, `year_${this.currentYear}`)
    
    const firstTen = this.transformQuestObj(loaded.slice(0, 10), 0)
    
    // Render all cards with initial data
    QuestionCard.renderWith(firstTen)
  },
  
  template: () => `
    <div id="questions-container"></div>
  `,
  
  stylesheet: {
    "#questions-container": `
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem 1rem;
    `,
  },
})

export default AppView