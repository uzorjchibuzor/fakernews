import React from 'react'
import PropTypes from 'prop-types'

const Search = ({ value, onChange, onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children} <input
      type="text"
      value={value}
      onChange={onChange} />
      <button type="submit">
        {children}
      </button>
    </form>
  )
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Search