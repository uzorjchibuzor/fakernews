import React, { Component } from 'react'
import './App.css'
import Search from '../Search/search'
import Button from '../Button/button'
import Table from '../Table/table'

import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
  } from '../../constants';


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

  componentDidMount() {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE)
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

export default App
