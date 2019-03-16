import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

function Item(props) {
  return (
    <button className="square">
      {props.value}
    </button>
  )
}

class Bin extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItem() {
    return (
      <Item value={this.props.value}/>
    )
  }

  render() {
    return (
      <div className="square">
        {this.renderItem(this.props.value)}
      </div>
    );
  }
}

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
      />
    );
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

