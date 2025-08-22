import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, theme } from 'antd'
import HeaderComp from './layout/Header'
import FooterComp from './layout/Footer'
import Sidebar from './layout/Sidebar'

const { Sider, Content } = Layout

const RootLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    return (
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Sidebar />
            </Sider>
            <Layout>
                <HeaderComp colorBgContainer={colorBgContainer} setCollapsed={setCollapsed} collapsed={collapsed} />
                <Content
                    style={{
                        padding: "10px 20px",
                        minHeight: 280,
                        overflow: "auto",
                        position: "relative"
                    }}
                >
                    <Outlet />
                </Content>
                <FooterComp />
            </Layout>
        </Layout>
    )
}

export default RootLayout
