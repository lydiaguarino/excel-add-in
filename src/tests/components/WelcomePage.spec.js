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
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';

import WelcomePage from '../../components/WelcomePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WelcomePage />, div);
});

it('renders welcome page - no dataset', () => {
  expect(renderer.create(<WelcomePage />).toJSON()).toMatchSnapshot();
});

it('renders welcome page - with dataset', () => {
  const dataset = {
    owner: 'test',
    id: 'test',
    title: 'This is a test',
    updated: '2017-07-20T14:24:51.762Z',
    created: '2017-07-20T14:24:51.762Z'
  };
  expect(
    renderer
      .create(
        <IntlProvider locale="en">
          <WelcomePage library={dataset} />
        </IntlProvider>
      )
      .toJSON()
  ).toMatchSnapshot();
});
