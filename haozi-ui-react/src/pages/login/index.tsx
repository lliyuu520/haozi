import React, {useState} from 'react'
import {Button, Card, Form, Input, message, Space} from 'antd'
import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import {useUserStore} from '@/stores'
import type {LoginForm} from '@/types/user'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useUserStore()

  const onFinish = async (values: LoginForm) => {
    setLoading(true)
    try {
      await login(values)
      message.success('登录成功')
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center full-height" style={{ background: '#f0f2f5' }}>
      <Card
        title="业务管理系统"
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>
          <Space>
            <span>用户名: admin</span>
            <span>密码: 123456</span>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default Login