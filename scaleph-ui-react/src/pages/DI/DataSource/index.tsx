import { Dict } from '@/app.d';
import { DICT_TYPE, PRIVILEGE_CODE } from '@/constant';
import { listDictDataByType } from '@/services/admin/dictData.service';
import {
  deleteDataSourceBatch,
  deleteDataSourceRow,
  listDataSourceByPage,
  showPassword,
} from '@/services/project/dataSource.service';
import { MetaDataSource } from '@/services/project/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Select, Space, Tooltip, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAccess, useIntl } from 'umi';
import DataSourceNewPre from './components/DataSourceNewPre';
import DorisDataSourceForm from './components/DorisDataSourceForm';
import GenericDataSourceForm from './components/GenericDataSourceForm';
import JdbcDataSourceForm from './components/JdbcDataSourceForm';
import KafkaDataSourceForm from './components/KafkaDataSourceForm';

const DataSource: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [selectedRows, setSelectedRows] = useState<MetaDataSource[]>([]);
  const [dataSourceTypeList, setDataSourceTypeList] = useState<Dict[]>([]);
  const [dataSourceNewPre, setDataSourceNewPre] = useState<boolean>(false);
  const [dataSourceFormData, setDataSourceFormData] = useState<{
    visiable: boolean;
    data: MetaDataSource;
  }>({ visiable: false, data: {} });
  const tableColumns: ProColumns<MetaDataSource>[] = [
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.dataSourceName' }),
      dataIndex: 'datasourceName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.dataSourceType' }),
      dataIndex: 'datasourceType',
      width: 140,
      render: (text, record, index) => {
        return record.datasourceType?.label;
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            showSearch={true}
            allowClear={true}
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {dataSourceTypeList.map((item) => {
              return (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.props' }),
      dataIndex: 'props',
      hideInSearch: true,
      width: 480,
      render: (text, record, index) => {
        return <span dangerouslySetInnerHTML={{ __html: record.propsStr + '' }}></span>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.remark' }),
      dataIndex: 'remark',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.createTime' }),
      dataIndex: 'createTime',
      hideInSearch: true,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'pages.di.dataSource.updateTime' }),
      dataIndex: 'updateTime',
      hideInSearch: true,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'app.common.operate.label' }),
      dataIndex: 'actions',
      align: 'center',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {access.canAccess(PRIVILEGE_CODE.datadevDatasourceSecurity) && (
              <Tooltip title={intl.formatMessage({ id: 'pages.di.dataSource.password.show' })}>
                <Button
                  shape="default"
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    showPassword(record).then((resp) => {
                      if (resp.success) {
                        Modal.info({
                          content: <Typography.Text>{resp.data}</Typography.Text>,
                          okText: intl.formatMessage({ id: 'app.common.operate.confirm.label' }),
                        });
                      }
                    });
                  }}
                ></Button>
              </Tooltip>
            )}
            {access.canAccess(PRIVILEGE_CODE.datadevDatasourceEdit) && (
              <Tooltip title={intl.formatMessage({ id: 'app.common.operate.edit.label' })}>
                <Button
                  shape="default"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setDataSourceFormData({ visiable: true, data: record });
                  }}
                ></Button>
              </Tooltip>
            )}
            {access.canAccess(PRIVILEGE_CODE.datadevDatasourceDelete) && (
              <Tooltip title={intl.formatMessage({ id: 'app.common.operate.delete.label' })}>
                <Button
                  shape="default"
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: intl.formatMessage({ id: 'app.common.operate.delete.confirm.title' }),
                      content: intl.formatMessage({
                        id: 'app.common.operate.delete.confirm.content',
                      }),
                      okText: intl.formatMessage({ id: 'app.common.operate.confirm.label' }),
                      okButtonProps: { danger: true },
                      cancelText: intl.formatMessage({ id: 'app.common.operate.cancel.label' }),
                      onOk() {
                        deleteDataSourceRow(record).then((d) => {
                          if (d.success) {
                            message.success(
                              intl.formatMessage({ id: 'app.common.operate.delete.success' }),
                            );
                            actionRef.current?.reload();
                          }
                        });
                      },
                    });
                  }}
                ></Button>
              </Tooltip>
            )}
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    listDictDataByType(DICT_TYPE.datasourceType).then((d) => {
      setDataSourceTypeList(d);
    });
  }, []);

  return (
    <div>
      <ProTable<MetaDataSource>
        headerTitle={intl.formatMessage({ id: 'pages.di.dataSource' })}
        search={{
          labelWidth: 'auto',
          span: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 },
        }}
        rowKey="id"
        actionRef={actionRef}
        formRef={formRef}
        options={false}
        columns={tableColumns}
        request={(params, sorter, filter) => {
          return listDataSourceByPage(params);
        }}
        toolbar={{
          actions: [
            access.canAccess(PRIVILEGE_CODE.datadevDatasourceAdd) && (
              <Button
                key="new"
                type="primary"
                onClick={() => {
                  setDataSourceNewPre(true);
                }}
              >
                {intl.formatMessage({ id: 'app.common.operate.new.label' })}
              </Button>
            ),
            access.canAccess(PRIVILEGE_CODE.datadevDatasourceDelete) && (
              <Button
                key="del"
                type="default"
                disabled={selectedRows.length < 1}
                onClick={() => {
                  Modal.confirm({
                    title: intl.formatMessage({ id: 'app.common.operate.delete.confirm.title' }),
                    content: intl.formatMessage({
                      id: 'app.common.operate.delete.confirm.content',
                    }),
                    okText: intl.formatMessage({ id: 'app.common.operate.confirm.label' }),
                    okButtonProps: { danger: true },
                    cancelText: intl.formatMessage({ id: 'app.common.operate.cancel.label' }),
                    onOk() {
                      deleteDataSourceBatch(selectedRows).then((d) => {
                        if (d.success) {
                          message.success(
                            intl.formatMessage({ id: 'app.common.operate.delete.success' }),
                          );
                          actionRef.current?.reload();
                        }
                      });
                    },
                  });
                }}
              >
                {intl.formatMessage({ id: 'app.common.operate.delete.label' })}
              </Button>
            ),
          ],
        }}
        pagination={{ showQuickJumper: true, showSizeChanger: true, defaultPageSize: 10 }}
        rowSelection={{
          fixed: true,
          onChange(selectedRowKeys, selectedRows, info) {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertRender={false}
        tableAlertOptionRender={false}
      ></ProTable>
      {dataSourceNewPre ? (
        <DataSourceNewPre
          visible={dataSourceNewPre}
          onCancel={() => {
            setDataSourceNewPre(false);
          }}
          onVisibleChange={(visiable) => {
            setDataSourceNewPre(visiable);
          }}
          data={{}}
          onSelect={(type) => {
            setDataSourceNewPre(false);
            setDataSourceFormData({ visiable: true, data: { datasourceType: { value: type } } });
          }}
        ></DataSourceNewPre>
      ) : null}
      {dataSourceFormData.visiable && dataSourceFormData.data.datasourceType?.value == 'JDBC' ? (
        <JdbcDataSourceForm
          visible={dataSourceFormData.visiable}
          onCancel={() => {
            setDataSourceFormData({ visiable: false, data: {} });
          }}
          onVisibleChange={(visiable) => {
            setDataSourceFormData({ visiable: visiable, data: {} });
            actionRef.current?.reload();
          }}
          data={dataSourceFormData.data}
        ></JdbcDataSourceForm>
      ) : null}
      {dataSourceFormData.visiable &&
        (dataSourceFormData.data.datasourceType?.value == 'Mysql' ||
          dataSourceFormData.data.datasourceType?.value == 'Oracle' ||
          dataSourceFormData.data.datasourceType?.value == 'PostGreSQL' ||
          dataSourceFormData.data.datasourceType?.value == 'ClickHouse') ? (
        <GenericDataSourceForm
          visible={dataSourceFormData.visiable}
          onCancel={() => {
            setDataSourceFormData({ visiable: false, data: {} });
          }}
          onVisibleChange={(visiable) => {
            setDataSourceFormData({ visiable: visiable, data: {} });
            actionRef.current?.reload();
          }}
          data={dataSourceFormData.data}
        ></GenericDataSourceForm>
      ) : null}
      {dataSourceFormData.visiable && dataSourceFormData.data.datasourceType?.value == 'Kafka' ? (
        <KafkaDataSourceForm
          visible={dataSourceFormData.visiable}
          onCancel={() => {
            setDataSourceFormData({ visiable: false, data: {} });
          }}
          onVisibleChange={(visiable) => {
            setDataSourceFormData({ visiable: visiable, data: {} });
            actionRef.current?.reload();
          }}
          data={dataSourceFormData.data}
        ></KafkaDataSourceForm>
      ) : null}
      {dataSourceFormData.visiable && dataSourceFormData.data.datasourceType?.value == 'Doris' ? (
        <DorisDataSourceForm
          visible={dataSourceFormData.visiable}
          onCancel={() => {
            setDataSourceFormData({ visiable: false, data: {} });
          }}
          onVisibleChange={(visiable) => {
            setDataSourceFormData({ visiable: visiable, data: {} });
            actionRef.current?.reload();
          }}
          data={dataSourceFormData.data}
        ></DorisDataSourceForm>
      ) : null}
    </div>
  );
};

export default DataSource;
