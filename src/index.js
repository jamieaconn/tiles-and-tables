import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom'
import { fromJS, List } from "immutable";

import './styles.css'
import Card from './card.js'
import Bin from './bin.js'
import games from './games.js'


class Board extends React.Component {
  constructor(props) {
    super(props);
    let game_index = 0
    let cards = []
    let values = games[game_index].values
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], state: 'normal'})
    }
    let data = fromJS({
      cards: cards,
      question_type: games[game_index].question_type,
      answer: games[game_index].answer,
      complete: false,
      game_index: game_index,
      question_text: games[game_index].question_text,
      chosen_cards: [],
    })
    this.state = {
      data: data
    }
  }

 
  handleClick(card_index) {
    let num_chosen_cards = this.state.data.get('chosen_cards').count()
    let newStateData = this.state.data.update("chosen_cards", (list) => list.push(card_index))
    console.log(newStateData)
    newStateData = newStateData.updateIn(["cards", card_index], 
      (card) => card
        .set('state', 'chosen')
    )
    if (num_chosen_cards + 1 === 2) {
      this.setState({data: newStateData}, () => this.checkIfCorrect())
    } else {
      this.setState({data: newStateData})
    }
  }

  checkIfCorrect() {
    let chosen_card_indexes = this.state.data.get('chosen_cards').toJS()
    console.log(chosen_card_indexes)
    let first_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[0], 'value'])
    console.log(first_chosen_value)
    let second_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[1], 'value'])
    console.log(second_chosen_value)
    let newStateData = this.state.data
    if (first_chosen_value * 7 === second_chosen_value) {
      console.log("correct")
      newStateData = newStateData.updateIn(["cards", chosen_card_indexes[0]],
        (card) => card
          .set('state', 'hidden')
      )
      newStateData = newStateData.updateIn(["cards", chosen_card_indexes[1]], 
        (card) => card
          .set('state', 'hidden')
      )
    } else {
      newStateData = newStateData.updateIn(["cards", chosen_card_indexes[0]],
        (card) => card
          .set('state', 'normal')
      )
      newStateData = newStateData.updateIn(["cards", chosen_card_indexes[1]], 
        (card) => card
          .set('state', 'normal')
      )
      console.log('incorrect')
    }
    newStateData = newStateData.update('chosen_cards', list => list.clear())
    this.setState({data: newStateData}, () => this.checkIfComplete())
  }

  checkIfComplete() {
    console.log(this.state.data.get('cards').toJS())
    let num_cards = this.state.data.get('cards').count()
    for (var i=0; i<num_cards; i++) {
      if (this.state.data.getIn(['cards', i, 'state']) === "normal") {
        console.log('not complete')
        return
      }
    }
    let newStateData = this.state.data.update("complete", value => true)
    this.state = newStateData
    console.log('complete')
  }
  restartGame() {
    let cards = []
    let values = games[this.state.game_index].values
    this.shuffleArray(values);
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], hidden: false})
    }
    let newStateData = {
      cards: cards,
      operation: games[this.state.game_index].operation,
      answer: games[this.state.game_index].answer,
      complete: false,
      game_index: this.state.game_index,
    };
    this.setState({data: newStateData})
        
  }

  renderCard(i) {
    return (
      <Card 
        key={i}
        value={this.state.data.getIn(['cards', i, 'value'])}
        index={i}
        state={this.state.data.getIn(['cards', i, 'state'])}
        onClick={this.handleClick.bind(this)}
      />
    );
  }
  renderCards() {
    let cards = []
    for (let i=0; i<this.state.data.get('cards').size; i++) {
      cards.push(
        <div className="col-4" style={{padding: '20px 0px'}}>
          {this.renderCard(i)}
        </div>
      )
    }
    return cards
  }

  renderBin(value) {
    return (
      <Bin
        value={value}
      />
    );
  }
  renderBins() {
    let chosen_card_indexes = this.state.data.get('chosen_cards').toJS()
    let first_chosen_value = "  ";
    let second_chosen_value = "  ";
    if (chosen_card_indexes.length === 1) {
      first_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[0], 'value']);
    }
    if (chosen_card_indexes.length === 2) {
      second_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[1], 'value']);
    }
    
    return (
      <div className="row">
        <div className="col-4">
          {this.renderBin(first_chosen_value)}
        </div>
        <div className="col-4">
          <h4 style={{padding: '20px 0px'}}>times 7 is</h4>
        </div>
        <div className="col-4">
          {this.renderBin(second_chosen_value)}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.data.get('complete')) {
      return (
        <div>
          <div>
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
        <div className="row">
          <h3>{this.state.data.get('question_text')} </h3>
        </div>
        {this.renderBins()}
        <div className="row">
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board" className="container" style={{padding: "20px"}}>
          <Board />
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

