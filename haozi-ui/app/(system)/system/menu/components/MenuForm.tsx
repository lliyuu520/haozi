'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  Tooltip,
  TreeSelect,
} from 'antd';
import { PlusOutlined, MenuOutlined, TagOutlined, ApiOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  MenuType,
  OpenStyle,
  getMenuList,
  createMenuWithNavigation,
  updateMenuWithNavigation,
  getMenuDetail,
  type MenuCreateParams,
  type MenuUpdateParams,
} from '@/services/menu';
import { MENU_ICON_OPTIONS } from '@/constants/menuIcons';
import type { MenuFormValues, MenuTreeSelectNode } from '@/types/menu';
import { MODAL_PRESENT_OPTIONS } from '@/types/menu';

interface MenuFormProps {
  mode: 'create' | 'edit' | 'view';
  menuId?: string;
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: Partial<MenuFormValues>;
}

export default function MenuForm({
  mode,
  menuId,
  onSuccess,
  onCancel,
  defaultValues
}: MenuFormProps) {
  const [form] = Form.useForm<MenuFormValues>();
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [treeData, setTreeData] = useState<MenuTreeSelectNode[]>([]);
  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';

  // 加载菜单树数据
  const loadMenuTree = useCallback(async () => {
    try {
      const response = await getMenuList({});
      const menuData = response.data ?? [];

      // 转换为树形选择数据
      const convertToTreeData = (menus: any[]): MenuTreeSelectNode[] => {
        return menus.map(menu => ({
          title: menu.name,
          key: menu.id.toString(),
          value: menu.id.toString(),
          children: menu.children ? convertToTreeData(menu.children) : undefined,
        }));
      };

      // 添加根节点选项
      const treeOptions: MenuTreeSelectNode[] = [
        {
          title: '根菜单',
          key: '0',
          value: '0',
          children: convertToTreeData(menuData),
        },
      ];
      setTreeData(treeOptions);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 加载菜单详情（编辑模式和查看模式）
  const loadMenuDetail = useCallback(async () => {
    if (!isEdit && !isReadOnly) return; // 只有编辑或查看模式才加载详情
    if (!menuId) return;

    setDetailLoading(true);
    try {
      const response = await getMenuDetail(menuId);
      const menuDetail = response.data;

      if (!menuDetail) {
        throw new Error('菜单详情为空');
      }

      form.setFieldsValue({
        parentId: menuDetail.parentId.toString(),
        name: menuDetail.name,
        url: menuDetail.url,
        perms: menuDetail.perms,
        type: menuDetail.type,
        openStyle: menuDetail.openStyle,
        weight: menuDetail.weight,
        icon: menuDetail.icon,
        hidden: menuDetail.hidden === 1,
        meta: {
          deeplink: false,
          keepAlive: true,
          modal: {
            present: 'default',
            width: 680,
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  }, [isEdit, isReadOnly, menuId]);

  useEffect(() => {
    void loadMenuTree();

    if (isEdit || isReadOnly) {
      void loadMenuDetail();
    } else {
      // 创建模式的默认值
      form.resetFields();
      form.setFieldsValue({
        parentId: "0",
        type: MenuType.MENU,
        openStyle: OpenStyle.INTERNAL,
        weight: 0,
        hidden: false,
        meta: {
          deeplink: false,
          keepAlive: true,
        },
        ...defaultValues
      });
    }
  }, [menuId, mode]); // 只依赖menuId和mode，避免重复调用

  // 提交表单
  const handleSubmit = async (values: MenuFormValues) => {
    if (isReadOnly) return;

    setLoading(true);
    try {
      // 转换 hidden 字段：boolean -> number
      const params: MenuCreateParams | MenuUpdateParams = {
        ...values,
        hidden: values.hidden ? 1 : 0,
      };

      if (isEdit && menuId) {
        await updateMenuWithNavigation({ ...params, id: menuId } as MenuUpdateParams);
      } else {
        await createMenuWithNavigation(params as MenuCreateParams);
      }

      const actionText = isEdit ? '更新' : '创建';
      // message.success(`${actionText}成功`);
      onSuccess();
    } catch (error) {
      console.error(error);
      const actionText = isEdit ? '更新' : '创建';
      // message.error(`${actionText}失败，请稍后再试`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
      <Form<MenuFormValues>
        form={form}
        layout="vertical"
        onFinish={isReadOnly ? undefined : handleSubmit}
        style={{ paddingRight: '8px' }}
      >
        <Form.Item
          name="parentId"
          label="上级菜单"
          rules={[{ required: !isReadOnly, message: '请选择上级菜单' }]}
          tooltip="选择该菜单的父级菜单，根菜单请选择'根菜单'"
        >
          <TreeSelect
            placeholder="请选择上级菜单"
            treeData={treeData}
            treeDefaultExpandAll
            showSearch
            allowClear
            treeLine={{ showLeafIcon: false }}
            disabled={isReadOnly}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="菜单名称"
          rules={[
            { required: !isReadOnly, message: '请输入菜单名称' },
            { min: 2, max: 20, message: '菜单名称长度应在2-20个字符之间' },
          ]}
          tooltip="显示在导航栏中的菜单名称"
        >
          <Input
            placeholder="请输入菜单名称"
            showCount
            maxLength={20}
            readOnly={isReadOnly}
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
            disabled={isReadOnly}
          >
            {MENU_ICON_OPTIONS.map(option => (
              <Select.Option key={option.value} value={option.value} label={option.label}>
                <Space>
                  {option.icon}
                  <span>{option.label}</span>
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="菜单类型"
          rules={[{ required: !isReadOnly, message: '请选择菜单类型' }]}
          tooltip="不同类型的菜单有不同的用途和配置项"
        >
          <Select placeholder="请选择菜单类型" disabled={isReadOnly}>
            <Select.Option value={MenuType.MENU}>
              <div className="flex items-center justify-between">
                <Space>
                  <MenuOutlined />
                  菜单
                </Space>
                <span className="text-xs text-gray-500">可导航的页面菜单项</span>
              </div>
            </Select.Option>
            <Select.Option value={MenuType.BUTTON}>
              <div className="flex items-center justify-between">
                <Space>
                  <TagOutlined />
                  按钮
                </Space>
                <span className="text-xs text-gray-500">页面功能按钮的权限控制</span>
              </div>
            </Select.Option>
            <Select.Option value={MenuType.INTERFACE}>
              <div className="flex items-center justify-between">
                <Space>
                  <ApiOutlined />
                  接口
                </Space>
                <span className="text-xs text-gray-500">API接口的访问权限</span>
              </div>
            </Select.Option>
          </Select>
        </Form.Item>

      {/* 动态表单字段 */}
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
                    rules={[{ required: !isReadOnly, message: '请输入路由地址' }]}
                    tooltip="React风格URL格式，如：system/menu/page"
                  >
                    <Input
                      placeholder="请输入路由地址，如：system/menu/page"
                      readOnly={isReadOnly}
                    />
                  </Form.Item>

                  <Form.Item
                    name="openStyle"
                    label="打开方式"
                    rules={[{ required: !isReadOnly, message: '请选择打开方式' }]}
                    tooltip="选择菜单的打开方式"
                  >
                    <Select placeholder="请选择打开方式" disabled={isReadOnly}>
                      <Select.Option value={OpenStyle.INTERNAL}>
                        <Space>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          内部打开
                          <span className="text-xs text-gray-500">在当前应用内打开</span>
                        </Space>
                      </Select.Option>
                      <Select.Option value={OpenStyle.EXTERNAL}>
                        <Space>
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          外部打开
                          <span className="text-xs text-gray-500">在新窗口或标签页打开</span>
                        </Space>
                      </Select.Option>
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
                    { required: !isReadOnly, message: '请输入权限标识' },
                    { pattern: /^[a-zA-Z:]+$/, message: '权限标识只能包含字母和冒号' },
                  ]}
                  tooltip={
                    type === MenuType.BUTTON
                      ? "用于控制页面按钮的显示权限，如：sys:user:add"
                      : "用于控制API接口的访问权限，如：sys:user:api"
                  }
                >
                  <Input
                    placeholder={
                      type === MenuType.BUTTON
                        ? "请输入权限标识，如：sys:user:add"
                        : "请输入权限标识，如：sys:user:api"
                    }
                    readOnly={isReadOnly}
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
            { required: !isReadOnly, message: '请输入排序权重' },
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
            disabled={isReadOnly}
          />
        </Form.Item>

        <Form.Item
          name="hidden"
          label="显示状态"
          valuePropName="checked"
          tooltip="控制菜单在前端的显示状态"
        >
          <Switch
            checkedChildren="显示"
            unCheckedChildren="隐藏"
            disabled={isReadOnly}
          />
        </Form.Item>

        {/* 元数据配置 */}
        <Form.Item label="元数据配置">
          <div className="space-y-4">
            <Form.Item
              name={['meta', 'deeplink']}
              label={
                <Space>
                  深度链接
                  <Tooltip title="是否支持通过URL直接访问该页面">
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              valuePropName="checked"
            >
              <Switch disabled={isReadOnly} />
            </Form.Item>

            <Form.Item
              name={['meta', 'keepAlive']}
              label={
                <Space>
                  页面缓存
                  <Tooltip title="是否缓存该页面状态，提升导航性能">
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </Space>
              }
              valuePropName="checked"
            >
              <Switch disabled={isReadOnly} />
            </Form.Item>

            {/* 弹窗配置 - 仅菜单类型显示 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === MenuType.MENU) {
                  return (
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-3 flex items-center">
                        弹窗配置
                        <Tooltip title="配置该页面以弹窗方式打开时的参数">
                          <InfoCircleOutlined className="text-gray-400 ml-2" />
                        </Tooltip>
                      </div>

                      <div className="space-y-4">
                        <Form.Item
                          name={['meta', 'modal', 'present']}
                          label="展示方式"
                        >
                          <Select
                            placeholder="请选择弹窗展示方式"
                            allowClear
                            options={[...MODAL_PRESENT_OPTIONS]}
                            disabled={isReadOnly}
                          />
                        </Form.Item>

                        <Form.Item
                          name={['meta', 'modal', 'width']}
                          label="弹窗宽度"
                        >
                          <InputNumber
                            placeholder="弹窗宽度（像素）"
                            style={{ width: '100%' }}
                            min={400}
                            max={1200}
                            step={50}
                            precision={0}
                            addonAfter="px"
                            disabled={isReadOnly}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>
          </div>
        </Form.Item>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>
              {isReadOnly ? '关闭' : '取消'}
            </Button>
            {!isReadOnly && (
              <Button type="primary" loading={loading} onClick={() => form.submit()}>
                {isEdit ? '更新' : '创建'}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}