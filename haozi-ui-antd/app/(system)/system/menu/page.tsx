'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tooltip,
  TreeSelect,
  message,
  Empty,
} from 'antd';
// TreeSelect 节点类型定义
interface TreeSelectNode {
  title: string;
  key: string;
  value: string;
  children?: TreeSelectNode[];
}
import { PlusOutlined, MenuOutlined, ApiOutlined, TagOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  MenuTreeNode,
  MenuDetail,
  MenuCreateParams,
  MenuUpdateParams,
  MenuType,
  OpenStyle,
  getMenuList,
  getMenuDetail,
  createMenu,
  updateMenu,
  deleteMenu,
} from '@/services/menu';
import { MenuTable } from '@/components/ui/MenuTable';
import { MENU_ICON_OPTIONS } from '@/constants/menuIcons';

const { Option } = Select;

// 菜单类型配置
const MENU_TYPE_CONFIG = {
  [MenuType.MENU]: {
    label: '菜单',
    icon: <MenuOutlined />,
    color: 'blue',
    description: '可导航的页面菜单项',
  },
  [MenuType.BUTTON]: {
    label: '按钮',
    icon: <TagOutlined />,
    color: 'green',
    description: '页面功能按钮的权限控制',
  },
  [MenuType.INTERFACE]: {
    label: '接口',
    icon: <ApiOutlined />,
    color: 'orange',
    description: 'API接口的访问权限',
  },
};

// 打开方式配置
const OPEN_STYLE_CONFIG = {
  [OpenStyle.INTERNAL]: {
    label: '内部',
    color: 'default',
    description: '在当前应用内打开',
  },
  [OpenStyle.EXTERNAL]: {
    label: '外部',
    color: 'purple',
    description: '在新窗口或标签页打开',
  },
};

export default function MenuManagementPage() {
  const [form] = Form.useForm<MenuCreateParams>();
  const [dataSource, setDataSource] = useState<MenuTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState<MenuType | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuDetail | null>(null);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  // 加载菜单数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMenuList({ type: menuType });
      const menuData = response.data ?? [];
      setDataSource(menuData);

      // 转换为树形选择数据
      const convertToTreeData = (menus: MenuTreeNode[]): TreeSelectNode[] => {
        return menus.map(menu => ({
          title: menu.name,
          key: menu.id.toString(),
          value: menu.id.toString(),
          children: menu.children ? convertToTreeData(menu.children) : undefined,
        }));
      };

      // 添加根节点选项
      const treeOptions: TreeSelectNode[] = [
        {
          title: '根菜单',
          key: '0',
          value: '0',
          children: convertToTreeData(menuData),
        },
      ];
      setTreeData(treeOptions);
    } catch (error) {
      message.error('加载菜单数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [menuType]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 处理添加
  const handleAdd = () => {
    setEditingMenu(null);
    form.resetFields();
    form.setFieldsValue({
      parentId: 0,
      type: MenuType.MENU,
      openStyle: OpenStyle.INTERNAL,
      icon: undefined,
      weight: 0,
    });
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = async (record: MenuTreeNode) => {
    try {
      const response = await getMenuDetail(record.id);
      const menuDetail = response.data;

      if (!menuDetail) {
        throw new Error('菜单详情为空');
      }

      setEditingMenu(menuDetail);
      form.setFieldsValue({
        parentId: menuDetail.parentId,
        name: menuDetail.name,
        url: menuDetail.url,
        perms: menuDetail.perms,
        type: menuDetail.type,
        openStyle: menuDetail.openStyle,
        icon: menuDetail.icon,
        weight: menuDetail.weight,
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error('获取菜单详情失败，请稍后再试');
    }
  };

  // 处理删除
  const handleDelete = async (menuId: number) => {
    try {
      await deleteMenu(menuId);
      message.success('删除成功');
      void loadData();
    } catch (error) {
      message.error('删除失败，请稍后再试');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: MenuCreateParams) => {
    setLoading(true);
    try {
      if (editingMenu) {
        const updateParams: MenuUpdateParams = {
          id: editingMenu.id,
          ...values,
        };
        await updateMenu(updateParams);
        message.success('更新成功');
      } else {
        await createMenu(values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      setEditingMenu(null);
      form.resetFields();
      void loadData();
    } catch (error) {
      message.error(editingMenu ? '更新失败，请稍后再试' : '创建失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = (record: MenuTreeNode) => {
    Modal.confirm({
      title: '确认删除菜单',
      content: `确定要删除菜单 "${record.name}" 吗？删除后不可恢复，请谨慎操作。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDelete(record.id),
    });
  };

  return (
    <div className="page-container">
      <Card
        title="菜单管理"
        extra={
          <Space>
            <Select
              allowClear
              placeholder="菜单类型"
              style={{ width: 140 }}
              value={menuType}
              onChange={setMenuType}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="px-2 py-1 text-xs text-gray-500 border-t">
                    过滤显示指定类型的菜单
                  </div>
                </>
              )}
            >
              <Option value={MenuType.MENU}>
                <Space>
                  <MenuOutlined />
                  菜单
                </Space>
              </Option>
              <Option value={MenuType.BUTTON}>
                <Space>
                  <TagOutlined />
                  按钮
                </Space>
              </Option>
              <Option value={MenuType.INTERFACE}>
                <Space>
                  <ApiOutlined />
                  接口
                </Space>
              </Option>
            </Select>
            <Button onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建菜单
            </Button>
          </Space>
        }
      >
        {dataSource.length > 0 ? (
          <MenuTable
            dataSource={dataSource}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
          />
        ) : (
          <Empty
            description="暂无菜单数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              创建第一个菜单
            </Button>
          </Empty>
        )}
      </Card>

      <Modal
        title={
          <Space>
            {editingMenu ? '编辑菜单' : '新建菜单'}
            <Tooltip title="菜单用于构建系统的导航结构和权限控制">
              <InfoCircleOutlined className="text-gray-400" />
            </Tooltip>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingMenu(null);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
            {editingMenu ? '保存' : '创建'}
          </Button>,
        ]}
        destroyOnClose
        maskClosable={false}
        width={640}
      >
        <Form<MenuCreateParams>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            parentId: 0,
            type: MenuType.MENU,
            openStyle: OpenStyle.INTERNAL,
            icon: undefined,
            weight: 0,
          }}
        >
          <Form.Item
            name="parentId"
            label="上级菜单"
            rules={[{ required: true, message: '请选择上级菜单' }]}
            tooltip="选择该菜单的父级菜单，根菜单请选择'根菜单'"
          >
            <TreeSelect
              placeholder="请选择上级菜单"
              treeData={treeData}
              treeDefaultExpandAll
              showSearch
              allowClear
              treeLine={{ showLeafIcon: false }}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="菜单名称"
            rules={[
              { required: true, message: '请输入菜单名称' },
              { min: 2, max: 20, message: '菜单名称长度应在2-20个字符之间' },
            ]}
            tooltip="显示在导航栏中的菜单名称"
          >
            <Input
              placeholder="请输入菜单名称"
              showCount
              maxLength={20}
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="菜单图标"
            tooltip="用于菜单树和侧边栏图标展示"
          >
            <Select
              placeholder="请选择菜单图标"
              allowClear
              optionLabelProp="label"
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {MENU_ICON_OPTIONS.map(option => (
                <Option key={option.value} value={option.value} label={option.label}>
                  <Space>
                    {option.icon}
                    <span>{option.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="菜单类型"
            rules={[{ required: true, message: '请选择菜单类型' }]}
            tooltip="不同类型的菜单有不同的用途和配置项"
          >
            <Select placeholder="请选择菜单类型">
              <Option value={MenuType.MENU}>
                <div className="flex items-center justify-between">
                  <Space>
                    <MenuOutlined />
                    菜单
                  </Space>
                  <span className="text-xs text-gray-500">
                    {MENU_TYPE_CONFIG[MenuType.MENU].description}
                  </span>
                </div>
              </Option>
              <Option value={MenuType.BUTTON}>
                <div className="flex items-center justify-between">
                  <Space>
                    <TagOutlined />
                    按钮
                  </Space>
                  <span className="text-xs text-gray-500">
                    {MENU_TYPE_CONFIG[MenuType.BUTTON].description}
                  </span>
                </div>
              </Option>
              <Option value={MenuType.INTERFACE}>
                <div className="flex items-center justify-between">
                  <Space>
                    <ApiOutlined />
                    接口
                  </Space>
                  <span className="text-xs text-gray-500">
                    {MENU_TYPE_CONFIG[MenuType.INTERFACE].description}
                  </span>
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === MenuType.MENU) {
                return (
                  <>
                    <Form.Item
                      name="url"
                      label="路由地址"
                      rules={[
                        { required: true, message: '请输入路由地址' },
                        { pattern: /^\//, message: '路由地址应以 / 开头' },
                      ]}
                      tooltip="前端页面的路由路径，如：/system/user"
                    >
                      <Input
                        placeholder="请输入路由地址，如：/system/user"
                        addonBefore="/"
                      />
                    </Form.Item>

                    <Form.Item
                      name="openStyle"
                      label="打开方式"
                      rules={[{ required: true, message: '请选择打开方式' }]}
                      tooltip="选择菜单的打开方式"
                    >
                      <Select placeholder="请选择打开方式">
                        <Option value={OpenStyle.INTERNAL}>
                          <Space>
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            内部打开
                            <span className="text-xs text-gray-500">
                              {OPEN_STYLE_CONFIG[OpenStyle.INTERNAL].description}
                            </span>
                          </Space>
                        </Option>
                        <Option value={OpenStyle.EXTERNAL}>
                          <Space>
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            外部打开
                            <span className="text-xs text-gray-500">
                              {OPEN_STYLE_CONFIG[OpenStyle.EXTERNAL].description}
                            </span>
                          </Space>
                        </Option>
                      </Select>
                    </Form.Item>
                  </>
                );
              }

              if (type === MenuType.BUTTON || type === MenuType.INTERFACE) {
                return (
                  <Form.Item
                    name="perms"
                    label="权限标识"
                    rules={[
                      { required: true, message: '请输入权限标识' },
                      { pattern: /^[a-zA-Z:]+$/, message: '权限标识只能包含字母和冒号' },
                    ]}
                    tooltip={
                      type === MenuType.BUTTON
                        ? "用于控制页面按钮的显示权限，如：sys:user:add"
                        : "用于控制API接口的访问权限，如：sys:user:api"
                    }
                  >
                    <Input
                      placeholder={type === MenuType.BUTTON
                        ? "请输入权限标识，如：sys:user:add"
                        : "请输入权限标识，如：sys:user:api"
                      }
                    />
                  </Form.Item>
                );
              }

              return null;
            }}
          </Form.Item>

          <Form.Item
            name="weight"
            label="排序权重"
            rules={[
              { required: true, message: '请输入排序权重' },
              { type: 'number', min: 0, max: 9999, message: '排序权重应在0-9999之间' },
            ]}
            tooltip="数字越小越靠前显示，相同数字按创建时间排序"
          >
            <InputNumber
              placeholder="请输入排序权重"
              style={{ width: '100%' }}
              min={0}
              max={9999}
              precision={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

