import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import './styles.css'
import Card from './card.js'

import games from './games.js'


class Board extends React.Component {
  constructor(props) {
    super(props);
    let game_index = 0
    let cards = []
    let values = games[game_index].values
    this.shuffleArray(values);
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], hidden: false})
    }
    this.state = {
      cards: cards,
      operation: games[game_index].operation,
      answer: games[game_index].answer,
      complete: false,
      game_index: game_index,
    };
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  renderCard(i) {
    return (
      <Card 
        key={i}
        value={this.state.cards[i].value}
        index={i}
        hidden={this.state.cards[i].hidden}
        onDrop={this.handleDrop.bind(this)}
      />
    );
  }

  checkCorrect(drop_index, card_index) {
    let drop_value = this.state.cards[drop_index].value
    let card_value = this.state.cards[card_index].value
    let answer = this.state.answer 
    let operation = this.state.operation
    if (operation === "add") {
      if (drop_value + card_value === answer) {
        return true
      } else {
        return false
      }
    } else if (operation === "multiply") {
      if (drop_value * card_value === answer) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  handleDrop(drop_index, card_index) {
    if (drop_index === card_index) {
      return;
    } else if (this.checkCorrect(drop_index, card_index)) {
      let newState = update(this.state, {
        cards: {
          [drop_index]: {
            hidden: {$set: true}
          },
          [card_index]: {
            hidden: {$set: true}
          }
        }
      })
      this.setState(newState)
      this.checkIfComplete()
    } else {
      return;
    }
  }

  checkIfComplete() {
    for (var i=0; i < this.state.cards.length; i++){
      if (this.state.cards[i].hidden === false) {
        return;
      }
    }
    let newState = update(this.state, {
      complete: {$set: true},
    })
    this.setState(newState)
  }

  create_board() {
    let board = []
    for (let i=0; i<this.state.cards.length; i++) {
      board.push(
        <div className="col-4">
          {this.renderCard(i)}
        </div>
      )
    }
    return board
  }

  restartGame() {
    let cards = []
    let values = games[this.state.game_index].values
    this.shuffleArray(values);
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], hidden: false})
    }
    let newState = {
      cards: cards,
      operation: games[this.state.game_index].operation,
      answer: games[this.state.game_index].answer,
      complete: false,
      game_index: this.state.game_index,
    };
    this.setState(newState)
        
  }

  render() {
    let style = {padding: "50px"}
    if (this.state.complete) {
      return (
        <div>
          <div style={style}>
            Nice one!
          </div>
          <button onClick={this.restartGame.bind(this)}>
            Play again
          </button>
        </div>
      )
    }
    return (
      <div>
        <h3 style={style}>Choose two cards that {this.state.operation} to make {this.state.answer}</h3>
        <div className="row">
          {this.create_board()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="gaAme-board" className="container">
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

