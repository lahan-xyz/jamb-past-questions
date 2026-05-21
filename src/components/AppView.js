import { Component } from 'queflow';
import Text  from '../nuggets/Text.js';

const AppView = new Component ('AppView', {
  template: () => {
    return (`
      <Text { txt: "Hello World", align: "left" } />
    `)
  }
}
)

export default AppView;