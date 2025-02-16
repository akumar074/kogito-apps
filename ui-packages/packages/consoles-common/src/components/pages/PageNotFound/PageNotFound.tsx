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

import React, { useState } from 'react';
import {
  PageSection,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Button,
  EmptyStateBody,
  Title
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Redirect, StaticContext, RouteComponentProps } from 'react-router';
import { componentOuiaProps, OUIAProps } from '@kogito-apps/ouia-tools';
import * as H from 'history';

interface IOwnProps {
  defaultPath: string;
  defaultButton: string;
}

export type LocationProps = H.LocationState & { prev?: string };

const PageNotFound: React.FC<
  IOwnProps &
    // eslint-disable-next-line @typescript-eslint/ban-types
    RouteComponentProps<{}, StaticContext, LocationProps> &
    OUIAProps
> = ({ ouiaId, ouiaSafe, ...props }) => {
  let prevPath;
  if (props.location.state !== undefined) {
    prevPath = props.location.state.prev;
  } else {
    prevPath = props.defaultPath;
  }

  const tempPath = prevPath.split('/');
  prevPath = tempPath.filter((item) => item);

  const [isRedirect, setIsredirect] = useState(false);
  const redirectHandler = () => {
    setIsredirect(true);
  };
  return (
    <>
      {isRedirect && <Redirect to={`/${prevPath[0]}`} />}
      <PageSection
        variant="light"
        {...componentOuiaProps(
          ouiaId,
          'page-not-found',
          ouiaSafe ? ouiaSafe : !isRedirect
        )}
      >
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon
              icon={ExclamationCircleIcon}
              color="var(--pf-global--danger-color--100)"
            />
            <Title headingLevel="h1" size="4xl">
              404 Error: page not found
            </Title>
            <EmptyStateBody>This page could not be found.</EmptyStateBody>
            <Button variant="primary" onClick={redirectHandler}>
              {props.defaultButton}
            </Button>
          </EmptyState>
        </Bullseye>
      </PageSection>
    </>
  );
};

export default PageNotFound;
