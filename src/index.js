import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './styles.css'
import Bin from './bin.js'



class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  }

  renderBin(i) {
    return (
      <Bin 
        value={this.state.items[i]}
        onDrop={this.handleDrop.bind(this)}
      />
    );
  }

  handleDrop(x, y) {
    if (x + y == 5) {
      console.log(this.state.items)
      let new_items = []
      for (let i=0; i < this.state.items.length; i++) {
        let number = this.state.items[i]
        if ((number != x) && (number != y)) {
          new_items.push(number)
        }
      }
      console.log(new_items)
      this.setState({
        items: new_items,
      });
    } else {
      console.log("False")
    }
  }

  create_board() {
    let board = []
    for (let i=0; i<this.state.items.length; i++) {
      board.push(
        <div>
          {this.renderBin(i)}
        </div>
      )
    }
    return board
  }

  render() {
    return (
      <div>
        {this.create_board()}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}


const GameWrapper = DragDropContext(HTML5Backend)(Game)


// ========================================

ReactDOM.render(
  <GameWrapper />,
  document.getElementById('root')
);

