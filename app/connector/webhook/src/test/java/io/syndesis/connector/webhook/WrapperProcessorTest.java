/*
 * Copyright (C) 2016 Red Hat, Inc.
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
package io.syndesis.connector.webhook;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.Collection;

import com.fasterxml.jackson.databind.jsonFormatVisitors.JsonFormatTypes;
import com.fasterxml.jackson.module.jsonSchema.JsonSchema;
import com.fasterxml.jackson.module.jsonSchema.types.ObjectSchema;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameter;
import org.junit.runners.Parameterized.Parameters;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(Parameterized.class)
public class WrapperProcessorTest {

    private static final String PARAMS_AND_BODY = "{\"parameters\":{\"param1\":\"param_value1\",\"param2\":\"param_value2\"},\"body\":{\"body1\":\"body_value1\",\"body2\":\"body_value2\"}}";

    private static final String ONLY_PARAMS = "{\"parameters\":{\"param1\":\"param_value1\",\"param2\":\"param_value2\"}}";

    @Parameter(0)
    public Object givenBody;

    @Parameter(1)
    public Object replacedBody;

    final ObjectSchema schema = new ObjectSchema();

    public WrapperProcessorTest() {
        final ObjectSchema parameters = new ObjectSchema();
        parameters.putProperty("param1", JsonSchema.minimalForFormat(JsonFormatTypes.STRING));
        parameters.putProperty("param2", JsonSchema.minimalForFormat(JsonFormatTypes.STRING));
        schema.putProperty("parameters", parameters);

        final ObjectSchema body = new ObjectSchema();
        body.putProperty("body1", JsonSchema.minimalForFormat(JsonFormatTypes.STRING));
        body.putProperty("body2", JsonSchema.minimalForFormat(JsonFormatTypes.STRING));
        schema.putProperty("body", body);
    }

    @Parameters
    public static Collection<Object[]> cases() {
        return Arrays.asList(//
            new Object[] {null, ONLY_PARAMS}, //
            new Object[] {"", ONLY_PARAMS}, //
            new Object[] {"{\"body1\":\"body_value1\",\"body2\":\"body_value2\"}", PARAMS_AND_BODY}, //
            new Object[] {new ByteArrayInputStream(new byte[0]), ONLY_PARAMS}//
        );

    }

    @Test
    public void testCases() throws Exception {
        final WrapperProcessor processor = new WrapperProcessor(schema);

        final Exchange exchange = mock(Exchange.class);
        final Message message = mock(Message.class);
        when(exchange.getIn()).thenReturn(message);
        when(message.getBody()).thenReturn(givenBody);
        when(message.getHeader("param1", String.class)).thenReturn("param_value1");
        when(message.getHeader("param2", String.class)).thenReturn("param_value2");

        processor.process(exchange);

        verify(message).setBody(replacedBody);
    }

}
