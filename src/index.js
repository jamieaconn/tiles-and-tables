import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import React from 'react'
import ReactDOM from 'react-dom'
import { fromJS } from "immutable";

import './styles.css'
import Card from './card.js'
import Bin from './bin.js'
import games from './games.js'


class Board extends React.Component {
  constructor(props) {
    super(props);
    let game_index = 2
    let cards = []
    let values = games[game_index].values
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], state: 'normal'})
    }
    let distractors = games[game_index].distractors
    for (let i=0; i < distractors.length; i++) {
      cards.push({value: distractors[i], state: 'normal'})
    }

    let shuffled_cards = this.shuffle(cards)
    let data = fromJS({
      cards: shuffled_cards,
      question_type: games[game_index].question_type,
      answer: games[game_index].answer,
      complete: false,
      game_index: game_index,
      operation: games[game_index].operation,
      instruction: games[game_index].instruction,
      question_text: games[game_index].question_text,
      chosen_cards: [],
    })
    this.state = {
      data: data
    }
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  } 


  handleClick(card_index) {
    let num_chosen_cards = this.state.data.get('chosen_cards').count()
    if (num_chosen_cards === 2) {
      return
    }
    let newStateData = this.state.data.update("chosen_cards", (list) => list.push(card_index))
    console.log(newStateData)
    newStateData = newStateData.updateIn(["cards", card_index], 
      (card) => card
        .set('state', 'chosen')
    )
    if (num_chosen_cards + 1 === 2) {
      this.setState(
        {data: newStateData}, () => 
          setTimeout(
            () => {
              this.handleAnswer()
            }, 500
          )
        )
    } else {
      this.setState({data: newStateData})
    }
  }

  handleAnswer() {
    let chosen_card_indexes = this.state.data.get('chosen_cards').toJS()
    console.log(chosen_card_indexes)
    let first_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[0], 'value'])
    console.log(first_chosen_value)
    let second_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[1], 'value'])
    console.log(second_chosen_value)
    let newStateData = this.state.data
    if (this.checkIfCorrect(first_chosen_value, second_chosen_value)) {
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

  checkIfCorrect(first_chosen_value, second_chosen_value) {
    let operation = this.state.data.get('operation')
    let question_type = this.state.data.get('question_type')
    let answer = this.state.data.get('answer')

    if (question_type === "_*n=_") {
      if (operation === "multiply") {
        if (first_chosen_value * answer === second_chosen_value) {
          return true
        } else {
          return false
        }
      } else if (operation === "add") {
        if (first_chosen_value + answer === second_chosen_value) {
          return true
        } else {
          return false
        }
      }
    } else if (question_type === "n*_=_") {
      if (operation === "multiply") {
        if (answer * first_chosen_value === second_chosen_value) {
          return true
        } else {
          return false
        }
      } else if (operation === "add") {
        if (answer + first_chosen_value === second_chosen_value) {
          return true
        } else {
          return false
        }
      }

    } else if (question_type === "_*_=n") {
      if (operation === "multiply") {
        if (first_chosen_value * second_chosen_value === answer) {
          return true
        } else {
          return false
        }
      } else if (operation === "add") {
        if (first_chosen_value + second_chosen_value === answer) {
          return true
        } else {
          return false
        }
      }
   
    }
  }


  checkIfComplete() {
    let num_values = games[this.state.data.get('game_index')].values.length
    let num_cards = this.state.data.get('cards').count()
    let num_hidden_cards = 0
    for (var i=0; i<num_cards; i++) {
      if (this.state.data.getIn(['cards', i, 'state']) === "hidden") {
        num_hidden_cards += 1
      }
    }
    if (num_hidden_cards != num_values) {
      console.log('not complete')
      return
    }
    let newStateData = this.state.data.update("complete", value => true)
    this.setState({data: newStateData})
    console.log('complete')
  }

  restartGame(game_index) {
    let cards = []
    let values = games[game_index].values
    for (let i=0; i < values.length; i++) {
      cards.push({value: values[i], state: 'normal'})
    }
    let distractors = games[game_index].distractors
    for (let i=0; i < distractors.length; i++) {
      cards.push({value: distractors[i], state: 'normal'})
    }

    let shuffled_cards = this.shuffle(cards)

    let newStateData = fromJS({
      cards: shuffled_cards,
      question_type: games[game_index].question_type,
      answer: games[game_index].answer,
      complete: false,
      game_index: game_index,
      operation: games[game_index].operation,
      instruction: games[game_index].instruction,
      question_text: games[game_index].question_text,
      chosen_cards: [],
    })
    console.log(newStateData)
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
        <div className="col-3" style={{padding: '20px 0px'}}>
          {this.renderCard(i)}
        </div>
      )
    }
    return cards
  }

  renderBins() {
    let chosen_card_indexes = this.state.data.get('chosen_cards').toJS()
    let first_chosen_value = "";
    let second_chosen_value = "";
    if (chosen_card_indexes.length >= 1) {
      first_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[0], 'value']);
    }
    if (chosen_card_indexes.length === 2) {
      second_chosen_value = this.state.data.getIn(['cards', chosen_card_indexes[1], 'value']);
    }
    let question_type = this.state.data.get('question_type')
    let question_text = this.state.data.get('question_text').toJS()
    if (question_type === "_*n=_") {
      return (
        <div className="row">
          <div className="col-3">
            <Bin value={first_chosen_value}/>
          </div>
          <div className="col-6">
            <h4 style={{padding: '20px 0px'}}>{question_text[0]}</h4>
          </div>
          <div className="col-3">
            <Bin value={second_chosen_value}/>
          </div>
        </div>
      )
    } else if (question_type === "n*_=_") {
      return (
        <div className="row">
          <div className="col-3">
            <h4 style={{padding: '20px 0px'}}>{question_text[0]}</h4>
          </div>
          <div className="col-3">
            <Bin value={first_chosen_value}/>
          </div>
          <div className="col-3">
            <h4 style={{padding: '20px 0px'}}>{question_text[1]}</h4>
          </div>
          <div className="col-3">
            <Bin value={second_chosen_value}/>
          </div>
        </div>
      )
    } else if (question_type === "_*_=n") {
      return (
        <div className="row">
          <div className="col-3">
            <Bin value={first_chosen_value}/>
          </div>
          <div className="col-3">
            <h4 style={{padding: '20px 0px'}}>{question_text[0]}</h4>
          </div>
          <div className="col-3">
            <Bin value={second_chosen_value}/>
          </div>
          <div className="col-3">
            <h4 style={{padding: '20px 0px'}}>{question_text[1]}</h4>
          </div>
        </div>
      )
    }
  }


  renderGameOptions() {
    let options = []
    for (var i=0; i<games.length; i++) {
      options.push(
       <li><a className="dropdown-item" onClick={this.restartGame.bind(this, i)} >{games[i].name}</a></li>
      )
    }
    return options
  }

  renderGameDropdown() {
    return (
      <div className="dropdown col-1 offset-5">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Switch game
        </button>
        <ul className="dropdown-menu" id="dropdown">
          {this.renderGameOptions()}
        </ul>
      </div>
    );
  }

  render() {
    if (this.state.data.get('complete')) {
      let game_index = this.state.data.get('game_index')
      return (
        <div>
          <div>
            <h3>Nice one!</h3>
          </div>
          <button className="btn btn-primary btn-lg" onClick={this.restartGame.bind(this, game_index)}>
            Play again
          </button>
        </div>
      )
    }
    return (
      <div>
        <div className="row">
          {this.renderGameDropdown()}
        </div>
        <div className="row">
          <h3>{this.state.data.get('instruction')} </h3>
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
        <div className="container" style={{padding: "20px"}}>
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

