import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import './styles.css'
import Bin from './bin.js'



class Board extends React.Component {
  constructor(props) {
    super(props);
    let cards = []
    let values = [1, 2, 3, 4, 6 ,7, 8, 9]
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], hidden: false})
    }
    this.state = {
      cards: cards,
      answer: 10,
    };
  }

  renderBin(i) {
    return (
      <Bin 
        value={this.state.cards[i].value}
        index={i}
        hidden={this.state.cards[i].hidden}
        onDrop={this.handleDrop.bind(this)}
      />
    );
  }

  handleDrop(bin_index, card_index) {
    if (this.state.cards[bin_index].value + this.state.cards[card_index].value === this.state.answer) {
      let newState = update(this.state, {
        cards: {
          [bin_index]: {
            hidden: {$set: true}
          },
          [card_index]: {
            hidden: {$set: true}
          }
        }
      })
      this.setState(newState)
      console.log(this.state.cards)
    } else {
      console.log("False")
    }
  }

  create_board() {
    let board = []
    for (let i=0; i<this.state.cards.length; i++) {
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

