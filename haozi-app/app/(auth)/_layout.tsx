import { Stack } from 'expo-router';

/** 认证路由组布局，不显示导航栏 */
export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
