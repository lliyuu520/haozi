import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { SearchForm } from '@/components/SearchForm/SearchForm';
import {
  createDictData,
  createDictType,
  deleteDictData,
  deleteDictType,
  getDictData,
  getDictType,
  listDictData,
  listDictTypes,
  updateDictData,
  updateDictType,
  type DictDataPayload,
  type DictDataQuery,
  type DictDataRecord,
  type DictTypePayload,
  type DictTypeQuery,
  type DictTypeRecord,
} from '@/features/system/dicts/api';
import { DictDataForm } from '@/features/system/dicts/DictDataForm';
import { DictTypeForm } from '@/features/system/dicts/DictTypeForm';

const DICT_TYPE_QUERY_KEY = ['system', 'dicts', 'types'];
const DICT_DATA_QUERY_KEY = ['system', 'dicts', 'data'];

export default function DictPage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [typeForm] = Form.useForm<Pick<DictTypeQuery, 'dictType' | 'dictName'>>();
  const [typeQuery, setTypeQuery] = useState<DictTypeQuery>({ page: 1, pageSize: 10 });
  const [dataQuery, setDataQuery] = useState<Omit<DictDataQuery, 'dictType'>>({ page: 1, pageSize: 10 });
  const [selectedType, setSelectedType] = useState<DictTypeRecord | null>(null);
  const [editingType, setEditingType] = useState<DictTypeRecord | null>(null);
  const [editingData, setEditingData] = useState<DictDataRecord | null>(null);
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [dataFormOpen, setDataFormOpen] = useState(false);

  const dictTypesQuery = useQuery({
    queryKey: [...DICT_TYPE_QUERY_KEY, typeQuery],
    queryFn: () => listDictTypes(typeQuery),
  });

  const dictDataQuery = useQuery({
    queryKey: [...DICT_DATA_QUERY_KEY, selectedType?.dictType, dataQuery],
    enabled: Boolean(selectedType?.dictType),
    queryFn: () =>
      listDictData({
        ...dataQuery,
        dictType: selectedType?.dictType ?? '',
      }),
  });

  useEffect(() => {
    if (selectedType || !dictTypesQuery.data?.items.length) {
      return;
    }
    setSelectedType(dictTypesQuery.data.items[0]);
  }, [dictTypesQuery.data?.items, selectedType]);

  const refreshTypes = () => {
    queryClient.invalidateQueries({ queryKey: DICT_TYPE_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DICT_DATA_QUERY_KEY });
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: DICT_DATA_QUERY_KEY });
  };

  const createTypeMutation = useMutation({
    mutationFn: createDictType,
    onSuccess: () => {
      message.success('新增字典类型成功');
      setTypeFormOpen(false);
      refreshTypes();
    },
  });

  const updateTypeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DictTypePayload }) => updateDictType(id, payload),
    onSuccess: () => {
      message.success('更新字典类型成功');
      setTypeFormOpen(false);
      setEditingType(null);
      setSelectedType(null);
      refreshTypes();
    },
  });

  const deleteTypeMutation = useMutation({
    mutationFn: deleteDictType,
    onSuccess: () => {
      message.success('删除字典类型成功');
      setSelectedType(null);
      refreshTypes();
    },
  });

  const createDataMutation = useMutation({
    mutationFn: createDictData,
    onSuccess: () => {
      message.success('新增字典数据成功');
      setDataFormOpen(false);
      refreshData();
    },
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DictDataPayload }) => updateDictData(id, payload),
    onSuccess: () => {
      message.success('更新字典数据成功');
      setDataFormOpen(false);
      setEditingData(null);
      refreshData();
    },
  });

  const deleteDataMutation = useMutation({
    mutationFn: deleteDictData,
    onSuccess: () => {
      message.success('删除字典数据成功');
      refreshData();
    },
  });

  const typeColumns: TableProps<DictTypeRecord>['columns'] = [
    {
      title: '字典类型',
      dataIndex: 'dictType',
      ellipsis: true,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Auth code="sys:dict:update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={async event => {
                event.stopPropagation();
                const detail = await getDictType(record.id);
                setEditingType(detail);
                setTypeFormOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth code="sys:dict:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={event => {
                event.stopPropagation();
                modal.confirm({
                  title: '删除字典类型',
                  content: `确定删除字典类型「${record.dictName}」吗？该类型下的字典数据也会被清理。`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteTypeMutation.mutateAsync(record.id),
                });
              }}
            >
              删除
            </Button>
          </Auth>
        </Space>
      ),
    },
  ];

  const dataColumns: TableProps<DictDataRecord>['columns'] = [
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
    },
    {
      title: '排序',
      dataIndex: 'weight',
      width: 90,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      render: value => value || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Auth code="sys:dict:update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await getDictData(record.id);
                setEditingData(detail);
                setDataFormOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth code="sys:dict:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '删除字典数据',
                  content: `确定删除字典数据「${record.dictLabel}」吗？`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteDataMutation.mutateAsync(record.id),
                });
              }}
            >
              删除
            </Button>
          </Auth>
        </Space>
      ),
    },
  ];

  const handleTypeSearch = (values: Pick<DictTypeQuery, 'dictType' | 'dictName'>) => {
    setSelectedType(null);
    setTypeQuery(current => ({ ...current, ...values, page: 1 }));
  };

  const handleTypeSubmit = (values: DictTypePayload) => {
    if (editingType) {
      updateTypeMutation.mutate({ id: editingType.id, payload: values });
    } else {
      createTypeMutation.mutate(values);
    }
  };

  const handleDataSubmit = (values: DictDataPayload) => {
    if (editingData) {
      updateDataMutation.mutate({ id: editingData.id, payload: values });
    } else {
      createDataMutation.mutate(values);
    }
  };

  return (
    <PageContainer title="字典管理">
      <SearchForm<Pick<DictTypeQuery, 'dictType' | 'dictName'>> form={typeForm} onFinish={handleTypeSearch}>
        <Form.Item name="dictType" label="字典类型">
          <Input allowClear placeholder="请输入字典类型" />
        </Form.Item>
        <Form.Item name="dictName" label="字典名称">
          <Input allowClear placeholder="请输入字典名称" />
        </Form.Item>
        <Space className="search-form__actions">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              typeForm.resetFields();
              setSelectedType(null);
              setTypeQuery({ page: 1, pageSize: typeQuery.pageSize });
            }}
          >
            重置
          </Button>
        </Space>
      </SearchForm>
      <div className="dict-workbench">
        <Card
          className="table-card"
          title="字典类型"
          extra={
            <Auth code="sys:dict:save">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingType(null);
                  setTypeFormOpen(true);
                }}
              >
                新增类型
              </Button>
            </Auth>
          }
        >
          <Table<DictTypeRecord>
            rowKey="id"
            columns={typeColumns}
            loading={dictTypesQuery.isFetching}
            dataSource={dictTypesQuery.data?.items ?? []}
            rowClassName={record => (record.id === selectedType?.id ? 'dict-workbench__selected-row' : '')}
            scroll={{ x: 560 }}
            onRow={record => ({
              onClick: () => {
                setSelectedType(record);
                setDataQuery({ page: 1, pageSize: dataQuery.pageSize });
              },
            })}
            pagination={{
              current: typeQuery.page,
              pageSize: typeQuery.pageSize,
              total: dictTypesQuery.data?.total ?? 0,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setSelectedType(null);
                setTypeQuery(current => ({ ...current, page, pageSize }));
              },
            }}
          />
        </Card>
        <Card
          className="table-card"
          title={
            <Space>
              <AppstoreOutlined />
              <span>{selectedType ? `${selectedType.dictName} 数据` : '字典数据'}</span>
            </Space>
          }
          extra={
            <Auth code="sys:dict:save">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled={!selectedType}
                onClick={() => {
                  setEditingData(null);
                  setDataFormOpen(true);
                }}
              >
                新增数据
              </Button>
            </Auth>
          }
        >
          <Table<DictDataRecord>
            rowKey="id"
            columns={dataColumns}
            loading={dictDataQuery.isFetching}
            dataSource={dictDataQuery.data?.items ?? []}
            locale={{ emptyText: selectedType ? '暂无字典数据' : '请先选择左侧字典类型' }}
            scroll={{ x: 620 }}
            pagination={{
              current: dataQuery.page,
              pageSize: dataQuery.pageSize,
              total: dictDataQuery.data?.total ?? 0,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条`,
              onChange: (page, pageSize) => setDataQuery({ page, pageSize }),
            }}
          />
        </Card>
      </div>
      <DictTypeForm
        open={typeFormOpen}
        submitting={createTypeMutation.isPending || updateTypeMutation.isPending}
        initialValues={editingType}
        onCancel={() => {
          setTypeFormOpen(false);
          setEditingType(null);
        }}
        onSubmit={handleTypeSubmit}
      />
      <DictDataForm
        open={dataFormOpen}
        submitting={createDataMutation.isPending || updateDataMutation.isPending}
        dictType={selectedType}
        initialValues={editingData}
        onCancel={() => {
          setDataFormOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleDataSubmit}
      />
    </PageContainer>
  );
}
