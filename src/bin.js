import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

import Card from './card'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}

const numberTarget = {
  drop(props) {
    return { 
      value: props.value,
    }
  },
}

class Bin extends React.Component {
  renderCard() {
    return (
      <Card value={this.props.value} onDrop={this.props.onDrop}/>
    )
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
      backgroundColor = 'darkgreen'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    return connectDropTarget(
      <div style={Object.assign({}, style, { backgroundColor })}>
        {this.renderCard(this.props.value)}
      </div>
    );
  }
}


export default DropTarget(ItemTypes.NUMBER, numberTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Bin)

