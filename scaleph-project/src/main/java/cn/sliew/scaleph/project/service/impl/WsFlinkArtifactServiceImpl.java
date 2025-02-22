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

package cn.sliew.scaleph.project.service.impl;

import cn.sliew.scaleph.dao.entity.master.ws.WsFlinkArtifact;
import cn.sliew.scaleph.dao.mapper.master.ws.WsFlinkArtifactMapper;
import cn.sliew.scaleph.project.service.WsFlinkArtifactService;
import cn.sliew.scaleph.project.service.convert.WsFlinkArtifactConvert;
import cn.sliew.scaleph.project.service.dto.WsFlinkArtifactDTO;
import cn.sliew.scaleph.project.service.param.WsFlinkArtifactListParam;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class WsFlinkArtifactServiceImpl implements WsFlinkArtifactService {

    @Autowired
    private WsFlinkArtifactMapper flinkArtifactMapper;

    @Override
    public Page<WsFlinkArtifactDTO> list(WsFlinkArtifactListParam param) {
        Page<WsFlinkArtifact> page = flinkArtifactMapper.selectPage(
                new Page<>(param.getCurrent(), param.getPageSize()),
                Wrappers.lambdaQuery(WsFlinkArtifact.class)
                        .eq(param.getProjectId() != null, WsFlinkArtifact::getProjectId, param.getProjectId())
                        .like(StringUtils.hasText(param.getName()), WsFlinkArtifact::getName, param.getName()));
        Page<WsFlinkArtifactDTO> result =
                new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        List<WsFlinkArtifactDTO> dtoList = WsFlinkArtifactConvert.INSTANCE.toDto(page.getRecords());
        result.setRecords(dtoList);
        return result;
    }

    @Override
    public WsFlinkArtifactDTO selectOne(Long id) {
        final WsFlinkArtifact record = flinkArtifactMapper.selectById(id);
        return WsFlinkArtifactConvert.INSTANCE.toDto(record);
    }

    @Override
    public WsFlinkArtifactDTO insert(WsFlinkArtifactDTO dto) {
        WsFlinkArtifact record = WsFlinkArtifactConvert.INSTANCE.toDo(dto);
        flinkArtifactMapper.insert(record);
        return selectOne(record.getId());
    }

    @Override
    public int update(WsFlinkArtifactDTO dto) {
        final WsFlinkArtifact record = WsFlinkArtifactConvert.INSTANCE.toDo(dto);
        return flinkArtifactMapper.updateById(record);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deleteById(Long id) {
        return flinkArtifactMapper.deleteById(id);
    }

}
