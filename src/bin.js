import React from 'react'

const style = {
  width: '100%',
  height: '60%',
}


function Bin(props) {
  return (
    <button className="btn btn-outline-dark btn-lg" disabled={true} style={style}>
      {props.value}
    </button>
  );
}

export default Bin
