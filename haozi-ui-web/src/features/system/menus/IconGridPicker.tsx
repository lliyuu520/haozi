import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Modal, Space, Typography, theme } from 'antd';
import { useMemo, useState } from 'react';
import { getMenuIcon, menuIconItems } from '@/app/route-manifest/icons';

type IconGridPickerProps = {
  value?: string;
  onChange?: (value: string) => void;
};

/**
 * 菜单图标选择器。
 *
 * 表单内只展示当前选择，完整图标网格放入弹窗，避免编辑菜单时占用过多空间。
 */
export function IconGridPicker({ value, onChange }: IconGridPickerProps) {
  const { token } = theme.useToken();
  const [keyword, setKeyword] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredIcons = useMemo(
    () => menuIconItems.filter(item => {
      const haystack = `${item.value} ${item.label}`.toLowerCase();
      return haystack.includes(normalizedKeyword);
    }),
    [normalizedKeyword],
  );
  const selectedIcon = getMenuIcon(value);

  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <div
        style={{
          alignItems: 'center',
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 12px',
        }}
      >
        <Space size={8}>
          <span style={{ color: token.colorPrimary, fontSize: 18, lineHeight: 1 }}>
            {selectedIcon}
          </span>
          <Typography.Text type={value ? undefined : 'secondary'}>
            {value || '未选择图标'}
          </Typography.Text>
        </Space>
        <Space size={8}>
          <Button onClick={() => setPickerOpen(true)}>
            {value ? '更换图标' : '选择图标'}
          </Button>
          {value && (
            <Button
              icon={<CloseOutlined />}
              onClick={() => onChange?.('')}
            >
              清空
            </Button>
          )}
        </Space>
      </div>
      <Modal
        title="选择菜单图标"
        open={pickerOpen}
        footer={null}
        onCancel={() => setPickerOpen(false)}
        width={720}
        destroyOnHidden
      >
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder="搜索图标名称，例如 User、Menu、Database"
          />
          <Typography.Text type="secondary">
            已加载 {menuIconItems.length} 个图标，当前显示 {filteredIcons.length} 个
          </Typography.Text>
          <div
            style={{
              display: 'grid',
              gap: 8,
              gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 1fr))',
              maxHeight: 360,
              overflowY: 'auto',
              paddingRight: 2,
            }}
          >
            {filteredIcons.map(item => {
              const checked = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={checked}
                  title={item.value}
                  onClick={() => {
                    onChange?.(item.value);
                    setPickerOpen(false);
                  }}
                  style={{
                    alignItems: 'center',
                    background: checked ? token.colorPrimaryBg : token.colorBgContainer,
                    border: `1px solid ${checked ? token.colorPrimary : token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    boxShadow: checked ? `0 0 0 2px ${token.colorPrimaryBg}` : token.boxShadowTertiary,
                    color: checked ? token.colorPrimary : token.colorText,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    height: 78,
                    justifyContent: 'center',
                    outline: 'none',
                    padding: 8,
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{getMenuIcon(item.value)}</span>
                  <span
                    style={{
                      fontSize: 11,
                      lineHeight: '14px',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="未找到匹配图标"
            />
          )}
        </Space>
      </Modal>
    </Space>
  );
}
