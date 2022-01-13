/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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
 */

import React from 'react';
import { mount } from 'enzyme';
import DevUIRoutes from '../DevUIRoutes';
import { MemoryRouter, Route } from 'react-router-dom';

jest.mock('../../../pages/ProcessesPage/ProcessesPage');
jest.mock('../../../pages/JobsManagementPage/JobsManagementPage');
jest.mock('../../../pages/FormsListPage/FormsListPage');

const MockedComponent = (): React.ReactElement => {
  return <></>;
};

jest.mock('@kogito-apps/consoles-common', () =>
  Object.assign({}, jest.requireActual('@kogito-apps/consoles-common'), {
    NoData: () => {
      return <MockedComponent />;
    },
    PageNotFound: () => {
      return <MockedComponent />;
    }
  })
);

jest.mock('@kogito-apps/trusty', () => ({
  ...jest.requireActual('@kogito-apps/trusty'),
  TrustyApp: () => {
    return <MockedComponent />;
  }
}));

const props = {
  trustyServiceUrl: 'http://url-to-service',
  navigate: 'JobsManagement'
};
describe('DevUIRoutes tests', () => {
  it('Test Jobs management route', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();

    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();

    const MockedJobsManagementPage = wrapper.find('MockedJobsManagementPage');
    expect(MockedJobsManagementPage.exists()).toBeTruthy();
  });
  it('processes test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/Processes']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();

    const MockedProcessListPage = wrapper.find('MockedProcessesPage');
    expect(MockedProcessListPage.exists()).toBeTruthy();
  });
  it('jobs management page test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/JobsManagement']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();

    const MockedJobsManagementPage = wrapper.find('MockedJobsManagementPage');
    expect(MockedJobsManagementPage.exists()).toBeTruthy();
  });

  it('forms list page test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/Forms']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();

    const MockedFormsListPage = wrapper.find('MockedFormsListPage');
    expect(MockedFormsListPage.exists()).toBeTruthy();
  });

  it('audit investigation page test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/Audit']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();

    const trusty = wrapper.find('TrustyApp');
    expect(trusty.exists()).toBeTruthy();

    const trustyProps = trusty.props();
    expect(trustyProps).not.toBeUndefined();
    expect(trustyProps['containerConfiguration']).not.toBeUndefined();
    expect(
      trustyProps['containerConfiguration']['serverRoot']
    ).not.toBeUndefined();
    expect(trustyProps['containerConfiguration']['serverRoot']).toEqual(
      props.trustyServiceUrl
    );
  });

  it('no data page test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/NoData']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();
    const noDataComponent = wrapper.find('NoData');
    expect(noDataComponent.exists()).toBeTruthy();
  });

  it('page not found page test', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['*']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();
    const pageNotFound = wrapper.find('PageNotFound');
    expect(pageNotFound.exists()).toBeTruthy();
  });

  it('Test NoData route', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['/NoData']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();
    const noDataComponent = wrapper.find('NoData');
    expect(noDataComponent.exists()).toBeTruthy();
  });

  it('Test PageNotFound route', () => {
    const wrapper = mount(
      <MemoryRouter keyLength={0} initialEntries={['*']}>
        <DevUIRoutes {...props} />
      </MemoryRouter>
    );

    expect(wrapper).toMatchSnapshot();
    const route = wrapper.find(Route);
    expect(route.exists()).toBeTruthy();
    const pageNotFound = wrapper.find('PageNotFound');
    expect(pageNotFound.exists()).toBeTruthy();
  });
});
