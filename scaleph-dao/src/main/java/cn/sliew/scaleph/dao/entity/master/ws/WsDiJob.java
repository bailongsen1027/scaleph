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

package cn.sliew.scaleph.dao.entity.master.ws;

import cn.sliew.scaleph.common.dict.common.YesOrNo;
import cn.sliew.scaleph.common.dict.seatunnel.SeaTunnelEngineType;
import cn.sliew.scaleph.dao.entity.BaseDO;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 数据集成-作业信息
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ws_di_job")
public class WsDiJob extends BaseDO {

    private static final long serialVersionUID = -4141741507654897469L;

    @TableField("flink_artifact_id")
    private Long flinkArtifactId;

    @TableField(exist = false)
    private WsFlinkArtifact wsFlinkArtifact;

    @TableField(value = "job_engine")
    private SeaTunnelEngineType jobEngine;

    @TableField("job_id")
    private String jobId;

    @TableField("dag_id")
    private Long dagId;

    @TableField("`current`")
    private YesOrNo current;
}
