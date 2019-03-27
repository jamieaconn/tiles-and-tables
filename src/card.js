import React from 'react'

const style = {
  height: '100%',
  width: '50%'
}


function Card(props) {
  if (props.state === "hidden") {
    return (
      <button className="btn btn-primary btn-lg" disabled={true} style={Object.assign({}, style, {opacity: 0})}>
        {props.value}
      </button>
    ) 
  } else if (props.state === "chosen") {
    return (
      <button className="btn btn-light btn-lg" disabled={true} style={style}>
        {props.value}
      </button>
    ) 
  } else {
    return (
      <button className="btn btn-primary btn-lg" style={style} onClick={() => props.onClick(props.index)}>
        {props.value}
      </button>
    );
  }
}

export default Card
