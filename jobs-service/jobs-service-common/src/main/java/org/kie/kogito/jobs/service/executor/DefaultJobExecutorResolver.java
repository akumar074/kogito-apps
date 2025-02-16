/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.kie.kogito.jobs.service.executor;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.kie.kogito.jobs.service.model.JobDetails;

@ApplicationScoped
public class DefaultJobExecutorResolver implements JobExecutorResolver {

    private Instance<JobExecutor> executors;

    @Inject
    public DefaultJobExecutorResolver(Instance<JobExecutor> executors) {
        this.executors = executors;
    }

    @Override
    public JobExecutor get(JobDetails jobDetails) {
        return executors.stream()
                .filter(executor -> executor.accept(jobDetails))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No JobExecutor found for " + jobDetails));
    }
}
