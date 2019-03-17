import React from 'react'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem',
  cursor: 'move',
  float: 'left',
}

const numberSource = {
  beginDrag(props) {
    return {
      value: props.value
    }
  },

  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    if (dropResult) {
      props.onDrop(dropResult.index, props.index)
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function Card(props) {
  if (props.hidden) {
    const opacity = 0
    return (
      <button style={Object.assign({}, style, { opacity })}>
        {props.value}
      </button>
    ) 
  } else {
    const { isDragging, connectDragSource } = props;
    const opacity = isDragging ? 0.4: 1
    return connectDragSource(
      <button style={Object.assign({}, style, { opacity })}>
        {props.value}
      </button>
    );
  }
}

export default DragSource(ItemTypes.NUMBER, numberSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Card)
