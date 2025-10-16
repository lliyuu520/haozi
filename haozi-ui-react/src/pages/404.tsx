import React from 'react'
import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const handleBackHome = () => {
    navigate('/home')
  }

  return (
    <div className="flex-center full-height">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" onClick={handleBackHome}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFound