import React from 'react'
import {Button, Card, Form, Input, message} from 'antd'
import {useNavigate} from 'react-router-dom'

const Password: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    message.success('密码修改成功')
    navigate('/home')
  }

  return (
    <Card title="修改密码" style={{ maxWidth: 500, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="原密码"
          name="oldPassword"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于6位' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            保存
          </Button>
          <Button onClick={() => navigate('/home')}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Password