import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './styles/index.css'
import {DevSupport} from '@react-buddy/ide-toolbox'
import {ComponentPreviews, useInitial} from '@/dev'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider locale={zhCN}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>,
)