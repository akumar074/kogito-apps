/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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

package org.kie.kogito.jitexecutor.dmn;

import java.io.StringReader;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.kie.api.io.Resource;
import org.kie.dmn.api.core.DMNContext;
import org.kie.dmn.api.core.DMNModel;
import org.kie.dmn.api.core.DMNResult;
import org.kie.dmn.api.core.DMNRuntime;
import org.kie.dmn.core.internal.utils.DMNRuntimeBuilder;
import org.kie.dmn.core.internal.utils.DynamicDMNContextBuilder;
import org.kie.internal.io.ResourceFactory;
import org.kie.kogito.jitexecutor.common.requests.MultipleResourcesPayload;
import org.kie.kogito.jitexecutor.common.requests.ResourceWithURI;
import org.kie.kogito.jitexecutor.dmn.utils.ResolveByKey;

public class DMNEvaluator {

    private final DMNModel dmnModel;
    private final DMNRuntime dmnRuntime;

    public static DMNEvaluator fromXML(String modelXML) {
        Resource modelResource = ResourceFactory.newReaderResource(new StringReader(modelXML), "UTF-8");
        DMNRuntime dmnRuntime = DMNRuntimeBuilder.fromDefaults().buildConfiguration()
                .fromResources(Collections.singletonList(modelResource)).getOrElseThrow(RuntimeException::new);
        DMNModel dmnModel = dmnRuntime.getModels().get(0);
        return new DMNEvaluator(dmnModel, dmnRuntime);
    }

    private DMNEvaluator(DMNModel dmnModel, DMNRuntime dmnRuntime) {
        this.dmnModel = dmnModel;
        this.dmnRuntime = dmnRuntime;
    }

    public DMNModel getDmnModel() {
        return dmnModel;
    }

    public String getNamespace() {
        return dmnModel.getNamespace();
    }

    public String getName() {
        return dmnModel.getName();
    }

    public Collection<DMNModel> getAllDMNModels() {
        return dmnRuntime.getModels();
    }

    public DMNResult evaluate(Map<String, Object> context) {
        DMNContext dmnContext = new DynamicDMNContextBuilder(dmnRuntime.newContext(), dmnModel).populateContextWith(context);
        return dmnRuntime.evaluateAll(dmnModel, dmnContext);
    }

    public static DMNEvaluator fromMultiple(MultipleResourcesPayload payload) {
        Map<String, Resource> resources = new HashMap<>();
        for (ResourceWithURI r : payload.getResources()) {
            Resource readerResource = ResourceFactory.newReaderResource(new StringReader(r.getContent()), "UTF-8");
            readerResource.setSourcePath(r.getURI());
            resources.put(r.getURI(), readerResource);
        }
        ResolveByKey rbk = new ResolveByKey(resources);
        DMNRuntime dmnRuntime = DMNRuntimeBuilder.fromDefaults()
                .setRelativeImportResolver((x, y, locationURI) -> rbk.readerByKey(locationURI))
                .buildConfiguration()
                .fromResources(resources.values())
                .getOrElseThrow(RuntimeException::new);
        DMNModel mainModel = null;
        for (DMNModel m : dmnRuntime.getModels()) {
            if (m.getResource().getSourcePath().equals(payload.getMainURI())) {
                mainModel = m;
                break;
            }
        }
        if (mainModel == null) {
            throw new IllegalStateException("Was not able to identify main model from MultipleResourcesPayload contents.");
        }
        return new DMNEvaluator(mainModel, dmnRuntime);
    }
}
