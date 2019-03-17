import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

import Card from './card'

const style = {
  padding: '0.5rem',
}

const numberTarget = {
  drop(props) {
    return { 
      value: props.value,
      index: props.index,
      hidden: props.hidden,
    }
  },
}

class Bin extends React.Component {
  renderCard() {
    return (
      <Card value={this.props.value} hidden={this.props.hidden} index={this.props.index} onDrop={this.props.onDrop}/>
    )
  }

  render() {
    let backgroundColor = 'white'
    if (this.props.hidden) {
      return (
        <div style={Object.assign({}, style, { backgroundColor})}>
          {this.renderCard}
        </div>
      )
    } else {
      const { canDrop, isOver, connectDropTarget } = this.props
      const isActive = canDrop && isOver
      if (isActive) {
        backgroundColor = 'darkgreen'
      } else if (canDrop) {
        backgroundColor = 'darkkhaki'
      }
      return connectDropTarget(
        <div style={Object.assign({}, style, { backgroundColor})}>
          {this.renderCard()}
        </div>
      );
    }
  }
}


export default DropTarget(ItemTypes.NUMBER, numberTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Bin)

