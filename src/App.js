import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_PAGE = 0

const PATH_BASE = 'http://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;

const largeColumn = {
  width: '40%',
  };
  const midColumn = {
  width: '30%',
  };
  const smallColumn = {
  width: '10%',
  };

const isSearched = (searchTerm) => (item) =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE)
    event.preventDefault()
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page != 0
      ? this.state.results.hits
      : []
    const updatedHits = [...oldHits, hits]
    this.setState({ result: {hits: updatedHits, page} })
  }

  fetchSearchTopStories(searchTerm, page) {
    fetch(`${url}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE)
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: {...this.state.result, hits: updatedHits }}
    )
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  render() {
    const { searchTerm, result } = this.state
    const page = (result && result.page) || 0
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            onChange={this.onSearchChange}
            value={searchTerm}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { result 
          ? <Table 
            list={result.hits}
            onDismiss={this.onDismiss} 
        />
        : null
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page +1 )}>
           More
          </Button>
        </div>
      </div>
    )
  }
}

const Search = ({ value, onChange, onSubmit,children }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
      type="text"
      value={value}
      onChange={onChange}
      />
      <button type='submit'>
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
