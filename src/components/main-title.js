import React from 'react'

const titleStyle = {
  textAlign: 'center',
  color: 'gray'
}

const subtitleStyle = {
  textAlign: 'center'
}

const MainTitle = ({ title }) => {
  return (
    <React.Fragment>
      <h1 style={titleStyle}>{title}</h1>
      <h4 style={subtitleStyle}>Search your fav book</h4>
    </React.Fragment>
  )
}

export default MainTitle
