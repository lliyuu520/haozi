import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/src/api/request';
import { saveToken } from '@/src/utils/token';
import { useAuthStore } from '@/src/store/authStore';
import type { LoginResult } from '@/src/types/auth';

/** 登录页 */
export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /** 执行登录 */
    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('请输入用户名和密码');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // 调用后端登录接口
            const result = await api.post<LoginResult>('/auth/login', {
                username: username.trim(),
                password,
            });

            // 持久化 token
            await saveToken(result.token);

            // 更新 Zustand 状态
            useAuthStore.getState().setCurrentUser(result.user);

            // 导航到首页
            router.replace('/(tabs)');
        } catch (e: any) {
            // 显示后端返回的中文错误消息
            const message = e?.message || '登录失败，请稍后再试';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.inner}>
                {/* 品牌标题 */}
                <Text style={styles.brand}>Haozi</Text>
                <Text style={styles.subtitle}>管理系统</Text>

                {/* 错误提示 */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* 用户名输入框 */}
                <TextInput
                    style={styles.input}
                    placeholder="用户名"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading}
                />

                {/* 密码输入框 */}
                <TextInput
                    style={styles.input}
                    placeholder="密码"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                    onSubmitEditing={handleLogin}
                />

                {/* 登录按钮 */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>登 录</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    brand: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1890ff',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 40,
    },
    errorBox: {
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#1890ff',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
