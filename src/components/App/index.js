import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import Table from "../Table/index";
import { Button, Loading } from "../Button/index";
import Search from "../Search/index";

import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from "../../constants/index";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}
            &${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;

console.log(url);

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const updateTopStories = (hits, page) => prevState => {
  const { results, searchKey } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];

  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } },
    isLoading: false
  };
};

class App extends Component {
  constructor(props) {
    //sets this.props to the constructor
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      isLoading: false
    };
    //bind the functions to App
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm = this.checkTopStoriesSearchTerm.bind(this);
  }

  checkTopStoriesSearchTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setTopStories(result) {
    //get the hits and page from result
    const { hits, page } = result;

    this.setState(updateTopStories(hits, page));
  }

  //fetch top stories
  fetchTopStories(searchTerm, page) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
            &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  //after mounting but before render function runs
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.checkTopStoriesSearchTerm(searchTerm)) {
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  removeItem(id) {
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];

    const updatedList = hits.filter(item => item.objectID !== id);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedList, page } }
    });
  }

  searchValue(event) {
    console.log("form search", event);
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { results, searchTerm, searchKey, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div>
        <Grid fluid>
          <Row>
            <div className="jumbotron text-center">
              <Search
                onChange={this.searchValue}
                value={searchTerm}
                onSubmit={this.onSubmit}
              >
                News App
              </Search>
            </div>
          </Row>
        </Grid>

        <Grid>
          <Row>
            <Table list={list} removeItem={this.removeItem} />

            <div className="text-center alert">
              <ButtonWithLoading
                isLoading={isLoading}
                className="btn btn-success"
                onClick={() => this.fetchTopStories(searchTerm, page + 1)}
              >
                Load More
              </ButtonWithLoading>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}

const ButtonWithLoading = withLoading(Button);

export default App;
