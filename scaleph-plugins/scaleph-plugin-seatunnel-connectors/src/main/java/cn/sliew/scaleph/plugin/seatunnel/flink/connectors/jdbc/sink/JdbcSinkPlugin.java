/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.sliew.scaleph.plugin.seatunnel.flink.connectors.jdbc.sink;

import cn.sliew.scaleph.common.dict.seatunnel.SeaTunnelPluginMapping;
import cn.sliew.scaleph.ds.modal.AbstractDataSource;
import cn.sliew.scaleph.ds.modal.jdbc.JdbcDataSource;
import cn.sliew.scaleph.plugin.framework.core.PluginInfo;
import cn.sliew.scaleph.plugin.framework.property.PropertyDescriptor;
import cn.sliew.scaleph.plugin.seatunnel.flink.SeaTunnelConnectorPlugin;
import cn.sliew.scaleph.plugin.seatunnel.flink.env.CommonProperties;
import cn.sliew.scaleph.plugin.seatunnel.flink.resource.ResourceProperties;
import cn.sliew.scaleph.plugin.seatunnel.flink.resource.ResourceProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.auto.service.AutoService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static cn.sliew.scaleph.plugin.seatunnel.flink.connectors.jdbc.JdbcProperties.*;
import static cn.sliew.scaleph.plugin.seatunnel.flink.connectors.jdbc.sink.JdbcSinkProperties.*;

@AutoService(SeaTunnelConnectorPlugin.class)
public class JdbcSinkPlugin extends SeaTunnelConnectorPlugin {

    public JdbcSinkPlugin() {
        this.pluginInfo = new PluginInfo(getIdentity(),
                "Jdbc Sink Plugin, output records from jdbc connection.",
                JdbcSinkPlugin.class.getName());

        final List<PropertyDescriptor> props = new ArrayList<>();
        props.add(CONNECTION_CHECK_TIMEOUT_SEC);
        props.add(COMPATIBLE_MODE);
        props.add(DATABASE);
        props.add(TABLE);
        props.add(SUPPORT_UPSERT_BY_QUERY_PRIMARY_KEY_EXIST);
        props.add(GENERATE_SINK_SQL);
        props.add(PRIMARY_KEYS);
        props.add(QUERY);
        props.add(MAX_RETRIES);
        props.add(BATCH_SIZE);
        props.add(IS_EXACTLY_ONCE);
        props.add(XA_DATA_SOURCE_CLASS_NAME);
        props.add(MAX_COMMIT_ATTEMPTS);
        props.add(TRANSACTION_TIMEOUT_SEC);
        props.add(AUTO_COMMIT);
        props.add(CommonProperties.PARALLELISM);
        props.add(CommonProperties.SOURCE_TABLE_NAME);
        supportedProperties = Collections.unmodifiableList(props);
    }

    @Override
    public List<ResourceProperty> getRequiredResources() {
        return Collections.singletonList(ResourceProperties.DATASOURCE_RESOURCE);
    }

    @Override
    public ObjectNode createConf() {
        ObjectNode conf = super.createConf();
        JsonNode jsonNode = properties.get(ResourceProperties.DATASOURCE);
        JdbcDataSource dataSource = (JdbcDataSource) AbstractDataSource.fromDsInfo((ObjectNode) jsonNode);
        conf.put(URL.getName(), dataSource.getUrl());
        conf.putPOJO(DRIVER.getName(), dataSource.getDriverClassName());
        conf.putPOJO(USER.getName(), dataSource.getUser());
        conf.putPOJO(PASSWORD.getName(), dataSource.getPassword());
        return conf;
    }

    @Override
    protected SeaTunnelPluginMapping getPluginMapping() {
        return SeaTunnelPluginMapping.SINK_JDBC;
    }

}
