import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_PAGE = 0
const DEFAULT_HPP = 100

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='


const largeColumn = {
  width: '40%',
  };
  const midColumn = {
  width: '30%',
  };
  const smallColumn = {
  width: '10%',
  };


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)  
    this.setSearchTopstories = this.setSearchTopstories.bind(this)
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]
  }

  setSearchTopstories(result) {
    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey] 
      ? results[searchKey] 
      : []
    
      const updatedHits = [
        oldHits,
        ...hits
        ]
    
    this.setState({
      results: {
        ...results, 
        [searchKey]: { hits: updatedHits, page }
       }
    })
    }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result))
    }
  componentDidMount() {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE)
  }

  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]
  
    const isNotId = (item) => item.objectID !== id
    const updatedHits = hits.filter(isNotId)
  
    this.setState({
      results: { 
        ...results, [searchKey]: { hits: updatedHits, page }
      }
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE)
    }
    event.preventDefault()
  }

  render() {
    const { searchTerm, results, searchKey } = this.state
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page) || 0

      const list = (
        results &&
        results[searchKey] &&
        results[searchKey].hits
      ) || []

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            onChange={(this.onSearchChange)}
            value={searchTerm}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
          <Table
          list={list}
          onDismiss={this.onDismiss}
          />
        
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}

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

const Table = ({ list, onDismiss }) => {
  return (
    <div className="table">
      { list.map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button 
                onClick={() => onDismiss(item.objectID)} 
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )
      }) }
    </div>
  )
}


const Button = ({onClick, className='', children}) => {
  return (
    <button 
      onClick = {onClick}
      >
      {children}
    </button>
  )
}

export default App
