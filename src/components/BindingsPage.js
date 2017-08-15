/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  Button,
  Dropdown,
  DropdownButton,
  Glyphicon,
  Grid,
  MenuItem,
  Row
} from 'react-bootstrap';

import './BindingsPage.css';
import BindingListItem from './BindingListItem';
import Icon from './icons/Icon'

class BindingsPage extends Component {

  static propTypes = {
    addBindingToExistingFile: PropTypes.func,
    bindings: PropTypes.array,
    createBinding: PropTypes.func,
    dataset: PropTypes.object,
    removeBinding: PropTypes.func,
    select: PropTypes.func,
    showAddData: PropTypes.func,
    sync: PropTypes.func,
    syncing: PropTypes.bool,
    syncStatus: PropTypes.object
  }

  static defaultProps = {
    bindings: []
  }

  state = {
    sortKey: 'updated'
  }

  getFilenameFromBinding = (binding) => {
    return `${binding.id.replace('dw::', '')}.csv`;
  }

  addFile = () => {
    this.props.showAddData();
  }

  datasetMenuOptionChange = () => {
    this.props.unlinkDataset();
  }

  sortFiles = () => {
    const sortKey = this.state.sortKey;
    const sortedFiles = this.props.dataset.files.slice();
    const reverseSort = sortKey.indexOf('-') === 0;

    sortedFiles.sort((a, b) => {
      if (sortKey.indexOf('name') >= 0) {
        if (a.name < b.name) {
          return reverseSort ?  1 : -1;
        } else if (a.title > b.title) {
          return reverseSort ? -1 : 1;
        }
        return 0;
      } else {
        let dateA, dateB;
        if (sortKey.indexOf('updated') >= 0) {
          dateA = new Date(a.updated);
          dateB = new Date(b.updated);
        } else {
          dateA = new Date(a.created);
          dateB = new Date(b.created);
        }
        return reverseSort ? dateA - dateB : dateB - dateA;
      }
    });
    return sortedFiles;
  }

  sortChanged = (sortKey) => {
    this.setState({sortKey})
  }

  addBindingToExistingFile = (file) => {
    this.props.showAddData(file.name);
  }

  findBindingForFile = (file) => {
    return this.props.bindings.find((binding) => {
      return binding.id === `dw::${file.name}`;
    });
  }

  render () {
    const { sortKey } = this.state;

    const {
      dataset,
      removeBinding,
      select,
      showAddData,
      syncing,
      syncStatus
    } = this.props;

    let bindingEntries = [];
    let unsyncedFileCount = 0;
    if (dataset && dataset.files.length) {
      const sortedFiles = this.sortFiles();
      
      bindingEntries = sortedFiles.map((file) => {
        const binding = this.findBindingForFile(file);
        if (binding && !syncStatus[binding.id].synced) {
          unsyncedFileCount += 1;
        }
        return (<BindingListItem binding={binding} file={file}
          key={file.name}
          select={select}
          syncing={syncing}
          syncStatus={binding && syncStatus[binding.id]}
          addBinding={this.addBindingToExistingFile}
          removeBinding={removeBinding}
          editBinding={showAddData} />);
      });
    }

    return (
      <Grid className='bindings-page'>
        <Row className='center-block section-header'>
          <div className='title'>
            {dataset.title}
            <Dropdown id='dropdown-dataset-options' className='pull-right' pullRight>
              <Dropdown.Toggle noCaret >
                <Glyphicon glyph='option-vertical' />
              </Dropdown.Toggle>
              <Dropdown.Menu pullRight bsSize='small' onSelect={this.datasetMenuOptionChange}>
                <MenuItem eventKey='unlink'>Unlink</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='dataset-link'>
            <a href={`https://data.world/${dataset.owner}/${dataset.id}`} target='_blank'>https://data.world/{dataset.owner}/{dataset.id}</a>
          </div>
          <div className='button-group'>
            <Button onClick={this.addFile}>
              <Icon icon='add' />
              Add File
            </Button>
            {!syncing && <Button onClick={() => this.props.sync()} disabled={!bindingEntries.length}>
              <Icon icon='sync' />
              Save Files
              {!!unsyncedFileCount && <Badge bsStyle='danger'>{unsyncedFileCount}</Badge>}
            </Button>}
            {syncing && <Button className='syncing-button'>
              <div className='loader-icon'></div>
              Syncing…
              </Button>}
          </div>
        </Row>
        {!!bindingEntries.length && 
          <Row className='center-block'>
            <div className='list-info'>
              {dataset.files.length} files
              <div className='pull-right sort-dropdown'>
                <DropdownButton title='Sort' pullRight bsSize='small' onSelect={this.sortChanged} id='dropdown-sort-files'>
                  <MenuItem eventKey='updated' active={sortKey === 'updated'}><Icon icon='check' />Updated: Newest</MenuItem>
                  <MenuItem eventKey='-updated' active={sortKey === '-updated'}><Icon icon='check' />Updated: Oldest</MenuItem>
                  <MenuItem eventKey='created' active={sortKey === 'created'}><Icon icon='check' />Created: Newest</MenuItem>
                  <MenuItem eventKey='-created' active={sortKey === '-created'}><Icon icon='check' />Created: Oldest</MenuItem>
                  <MenuItem eventKey='name' active={sortKey === 'name'}><Icon icon='check' />Name: A - Z</MenuItem>
                  <MenuItem eventKey='-name' active={sortKey === '-name'}><Icon icon='check' />Name: Z - A</MenuItem>
                </DropdownButton>
              </div>
            </div>
            <div>
              {bindingEntries}
            </div>
          </Row>}
        {!bindingEntries.length && 
          <Row className='center-block no-datasets'>
            <div className='message'>
              You haven't added any data to this dataset.
            </div>
            <Button className='bottom-button' bsStyle='primary' onClick={this.addFile}>Add data</Button>
          </Row>}
      </Grid>
    );
  }
}

export default BindingsPage;