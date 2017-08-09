import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Grid,
  Row
} from 'react-bootstrap';

import './WelcomePage.css';
import sparkle from '../static/img/new-sparkle-logo.png';
import DatasetItem from './DatasetItem';

class WelcomePage extends Component {

  static propTypes = {
    dataset: PropTypes.object
  }

  constructor () {
    super();
    this.oauthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
    this.oauthRedirectURI = process.env.REACT_APP_OAUTH_REDIRECT_URI;
  }

  componentWillMount = () => {
    document.body.style.backgroundColor = '#335c8c';
  }
  componentWillUnmoun = () => {
    document.body.style.backgroundColor = null;
  }

  startAuthFlow = () => {
    window.location = `https://data.world/oauth/authorize?client_id=${this.oauthClientId}&redirect_uri=${this.oauthRedirectURI}`;
  }

  viewDataset = () => {

  }

  render () {
    const {dataset} = this.props;
    return (
      <Grid className='welcome-page'>
        <Row className='center-block'>
          <img src={sparkle} className='header-image center-block' alt='data.world sparkle logo' />
          <h1 className='header'>data.world</h1>
          {!dataset && <div>
            <div className='description'>Lorem ipsum dolor sit amet consecteur.</div>
          </div>}
          {dataset && <div>
            <div>This file is linked to a dataset on data.world:</div>
            <DatasetItem dataset={dataset} buttonText='View' buttonLink={`https://data.world/${dataset.owner}/${dataset.id}`}
              buttonHandler={this.viewDataset} />
            <div className='message'>Sign in to data.world to save changes as they are made.</div>
          </div>}
          <Button
            className='center-block login-button'
            onClick={this.startAuthFlow}
            bsStyle='primary'>Sign in</Button>
          <div>New to data.world? <a href='https://data.world/' target='_blank'> Sign up now</a></div>
        </Row>
      </Grid>
    );
  }
}

export default WelcomePage;