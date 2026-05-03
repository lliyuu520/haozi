import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/authStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

/** 认证守卫：根据登录状态自动跳转 */
function AuthGuard() {
    const router = useRouter();
    const segments = useSegments();
    const { initialized, user } = useAuthStore();

    // 应用启动时恢复会话
    useEffect(() => {
        useAuthStore.getState().initialize();
    }, []);

    // 根据登录状态进行路由守卫
    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // 未登录且不在认证页面，跳转登录
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // 已登录但在认证页面，跳转首页
            router.replace('/(tabs)');
        }
    }, [initialized, user, segments]);

    // 初始化未完成时显示全屏加载
    if (!initialized) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#1890ff" />
            </View>
        );
    }

    return <Slot />;
}

/** 根布局：包裹全局 Provider 和认证守卫 */
export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthGuard />
            <StatusBar style="auto" />
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
