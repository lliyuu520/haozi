import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/** Tab 导航布局 */
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#1890ff',
                headerStyle: { backgroundColor: '#fff' },
                headerTitleStyle: { fontWeight: '600' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '首页',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '我的',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
