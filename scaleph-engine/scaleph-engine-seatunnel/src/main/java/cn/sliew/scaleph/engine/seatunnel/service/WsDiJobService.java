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

package cn.sliew.scaleph.engine.seatunnel.service;

import cn.sliew.scaleph.engine.seatunnel.service.dto.WsDiJobDTO;
import cn.sliew.scaleph.engine.seatunnel.service.param.*;
import cn.sliew.scaleph.engine.seatunnel.service.vo.DiJobAttrVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

public interface WsDiJobService {

    Page<WsDiJobDTO> listByPage(WsDiJobListParam param);

    List<WsDiJobDTO> listAll(WsDiJobSelectListParam param);

    WsDiJobDTO selectOne(Long id);

    WsDiJobDTO insert(WsDiJobAddParam param);

    int update(WsDiJobUpdateParam param);

    int delete(Long id);

    int deleteBatch(List<Long> ids);

    WsDiJobDTO queryJobGraph(Long id);

    Long saveJobStep(WsDiJobStepParam param);

    Long saveJobGraph(WsDiJobGraphParam param);

    DiJobAttrVO listJobAttrs(Long id);

    Long saveJobAttrs(DiJobAttrVO vo);

    Long totalCnt(String jobType);

}
