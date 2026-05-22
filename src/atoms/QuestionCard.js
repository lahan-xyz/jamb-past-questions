import { Atom } from 'queflow'

const QuestionCard = new Atom("QuestionCard", {
  template: (props, index) => {
    
   return (`
    <div class="qc-card">
      <!-- question header -->
      <div class="qc-header">
        <div class="qc-badge">
          <span class="qc-badge-label">Q</span>
          <span class="qc-badge-num">{{ quest_no }}</span>
        </div>
        <span class="qc-year">{{ year }}</span>
      </div>

      <!-- question image -->
      <div class="qc-image-wrap" q:show="{{ src }}">
        <img class="qc-image" src="../src/scraper/images/{{ src }}" alt="{{ year }} Question diagram" />
      </div>

      <!-- question body -->
      <div class="qc-body">
        <p class="qc-text">{{ question }}</p>

        <!-- options -->
        <div class="qc-options">
          <button class="qc-opt" data-letter="A">
            <span class="qc-opt-letter">A</span>
            <span class="qc-opt-text">{{ options[0] }}</span>
          </button>
          <button class="qc-opt" data-letter="B">
            <span class="qc-opt-letter">B</span>
            <span class="qc-opt-text">{{ options[1] }}</span>
          </button>
          <button class="qc-opt" data-letter="C">
            <span class="qc-opt-letter">C</span>
            <span class="qc-opt-text">{{ options[2] }}</span>
          </button>
          <button class="qc-opt" data-letter="D">
            <span class="qc-opt-letter">D</span>
            <span class="qc-opt-text">{{ options[3] }}</span>
          </button>
          <button class="qc-opt" data-letter="E" q:show="{{ options[4] }}">
            <span class="qc-opt-letter">E</span>
            <span class="qc-opt-text">{{ options[4] }}</span>
          </button>
        </div>
      </div>
    </div>
  `)
  },
  
  stylesheet: {
    // ----- card shell -----
    ".qc-card": `
      background: radial-gradient(circle at 20% 20%, #1b1b28, #0d0d14);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 28px;
      padding: 2.2rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02);
      backdrop-filter: blur(2px);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
      margin-block: 40px;
      position: relative;
      overflow: hidden;
    `,
    ".qc-card::before": `
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(circle at 50% 0%, rgba(74,222,128,0.08), transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    `,
    ".qc-card:hover": `
      transform: translateY(-3px);
      border-color: rgba(74,222,128,0.3);
      box-shadow: 0 20px 45px rgba(0,0,0,0.7), 0 0 0 1px rgba(74,222,128,0.2);
    `,
    ".qc-card:hover::before": `
      opacity: 1;
    `,
    
    // ----- header -----
    ".qc-header": `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.2rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    `,
    ".qc-badge": `
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #4ade80, #22c55e);
      color: #000;
      font-weight: 800;
      font-size: 1.3rem;
      padding: 0.4rem 1.2rem 0.4rem 0.8rem;
      border-radius: 40px;
      box-shadow: 0 0 20px rgba(74,222,128,0.5), 0 4px 10px rgba(0,0,0,0.3);
      letter-spacing: 0.5px;
    `,
    ".qc-badge-label": `
      font-size: 0.85rem;
      background: rgba(0,0,0,0.2);
      padding: 0.1rem 0.5rem;
      border-radius: 20px;
      margin-right: 2px;
    `,
    ".qc-badge-num": `
      font-variant-numeric: tabular-nums;
    `,
    ".qc-year": `
      font-size: 0.85rem;
      font-weight: 500;
      color: #888;
      letter-spacing: 0.6px;
      background: rgba(255,255,255,0.03);
      padding: 0.3rem 1rem;
      border-radius: 30px;
      border: 1px solid rgba(255,255,255,0.05);
    `,
    
    // ----- image -----
    ".qc-image-wrap": `
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    `,
    ".qc-image": `
      width: 100%;
      height: auto;
      display: block;
      background: #0a0a0f;
      object-fit: contain;
      padding: 0.8rem;
    `,
    
    // ----- body -----
    ".qc-body": `
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
    `,
    ".qc-text": `
      font-size: 1.2rem;
      font-weight: 450;
      line-height: 1.8;
      color: #e4e4e7;
      margin: 0;
      letter-spacing: 0.2px;
    `,
    
    // ----- options -----
    ".qc-options": `
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `,
    ".qc-opt": `
      all: unset;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 1rem 1.2rem;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      color: #ccc;
      font-size: 0.95rem;
      font-weight: 450;
      position: relative;
    `,
    ".qc-opt::after": `
      content: "";
      position: absolute;
      left: -2px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(to bottom, #4ade80, #22c55e);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.2s, width 0.2s;
    `,
    ".qc-opt:hover": `
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.15);
      transform: translateX(6px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `,
    ".qc-opt:hover::after": `
      opacity: 1;
      width: 6px;
    `,
    ".qc-opt:active": `
      transform: scale(0.98);
      background: rgba(255,255,255,0.09);
    `,
    ".qc-opt-letter": `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #232330;
      font-weight: 700;
      font-size: 0.8rem;
      color: #aaa;
      flex-shrink: 0;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    `,
    ".qc-opt:hover .qc-opt-letter": `
      background: #4ade80;
      color: #000;
      box-shadow: 0 0 12px #4ade80;
    `,
    ".qc-opt-text": `
      flex: 1;
    `,
    
    // ----- responsive -----
    "@media (max-width: 500px)": {
      ".qc-card": `
        padding: 1.6rem 1.3rem;
        border-radius: 22px;
        gap: 1.2rem;
      `,
      ".qc-text": `
        font-size: 1rem;
      `,
      ".qc-opt": `
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
      `,
      ".qc-badge": `
        font-size: 1.1rem;
        padding: 0.3rem 1rem 0.3rem 0.6rem;
      `,
    },
  },
  
  isReactive: true,
}, "questions-container")

export default QuestionCard