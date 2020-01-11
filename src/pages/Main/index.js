import React, { Component } from 'react';
import {
  FaGithubAlt,
  FaPlus,
  FaSpinner,
  FaArrowCircleRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Form, SubmitButton, List } from './styles';
import api from '../../services/api';
import Container from '../../components/Container';

export default class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  // Carregar os dados
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;
    const response = await api.get(`/repos/${newRepo}`);
    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Github Repository Search
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search Repository"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {/* Conditional Rendering */}
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                <FaArrowCircleRight
                  color="#232526"
                  size={14}
                  title="Go to repository description"
                />
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
