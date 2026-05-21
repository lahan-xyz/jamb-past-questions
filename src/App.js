import { App } from 'queflow';
import AppView from './components/AppView.js';
import Text  from './nuggets/Text.js';


const JambApp = new App('#app', {
  template: () => {
    return (`
      <AppView/>
      <Text { txt: "From App", color: "teal" } />
    `)
  },
  stylesheet: {
    "html, body": `
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    `
  }
})

JambApp.render();