import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext } from 'react-dnd';
import { DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './index.css'



const ItemTypes = {
  NUMBER: 'number'
};


const numberSource = {
  beginDrag(props) {
    return {
      value: props.value
    }
  }
};


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function Number(props) {
  const { isDragging, connectDragSource } = props;

  return connectDragSource(
    <button className="square">
      {props.value}
    </button>
  );
}


const WrappedNumber = DragSource(ItemTypes.NUMBER, numberSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Number)

class Bin extends React.Component {
  constructor(props) {
    super(props);
  }

  renderNumber() {
    return (
      <WrappedNumber value={this.props.value}/>
    )
  }

  render() {
    return (
      <div className="square">
        {this.renderNumber(this.props.value)}
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


const GameWrapper = DragDropContext(HTML5Backend)(Game)


// ========================================

ReactDOM.render(
  <GameWrapper />,
  document.getElementById('root')
);

