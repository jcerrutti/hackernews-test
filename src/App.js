import React, { Component } from 'react'
import axios from 'axios'

import './App.css'

import Search from './components/search'
import Table from './components/table'
import MainTitle from './components/main-title'
import Button from './components/button'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = 100

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      title: 'The Book Store',
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
      )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => error)

    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    //   .then(response => response.json())
    //   .then(result => this.setSearchTopStories(result))
    //   .catch(error => error)
  }

  setSearchTopStories(result) {
    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey] ? results[searchKey] : []

    const updatedHits = [...oldHits, ...hits]

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    })
  }

  onSearchSubmit(event) {
    event.preventDefault()
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }
  }

  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]

    const updatedHits = hits.filter(item => item.objectID !== id)

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }

  render() {
    const { searchTerm, searchKey, results, title } = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || []
    return (
      <div className="page">
        <MainTitle title={title} />
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        <Table list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    )
  }
}

export default App
