import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import flow from 'lodash/flow'

const style = {
  cursor: 'move',
  margin: '10px',
  width: '60px'
}

const numberSource = {
  beginDrag(props) {
    return {
      value: props.value
    }
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult()
    if (dropResult) {
      props.onDrop(dropResult.index, props.index)
    }
  }
};


const numberTarget = {
  drop(props) {
    return { 
      value: props.value,
      index: props.index,
      hidden: props.hidden,
    }
  },
}

function Card(props) {
  if (props.hidden) {
    const opacity = 0
    return (
      <button className="btn btn-primary btn-lg" style={Object.assign({}, style, { opacity })}>
        {props.value}
      </button>
    ) 
  } else {
    const { isDragging, connectDragSource, isOver, connectDropTarget } = props;
    const className = isOver ? "btn btn-primary btn-lg active" : "btn btn-primary btn-lg"
    const opacity = isDragging ? 0.4: 1
    return connectDragSource(connectDropTarget(
      <button className={className} style={Object.assign({}, style, { opacity })}>
        {props.value}
      </button>
    ));
  }
}

export default flow(
  DropTarget(ItemTypes.NUMBER, numberTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })),
  DragSource(ItemTypes.NUMBER, numberSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))
)(Card)
