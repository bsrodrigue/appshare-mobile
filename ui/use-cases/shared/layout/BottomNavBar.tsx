import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { usePathname, useSegments } from 'expo-router';

// Default BottomNavBar Settings

const defaultTabItems = [
    { name: 'home-screen', icon: 'store', color: theme.colors.accent },
    { name: 'gift-screen', icon: 'gift', color: theme.colors.accent },
    { name: 'user-screen', icon: 'user', color: theme.colors.accent },
    { name: 'menu-screen', icon: 'dots-three-horizontal', color: theme.colors.accent },
];

interface TabItem {
    name: string;
    icon: string;
    color: string;
}

interface BottomNavBarProps {
    activeTab: string;
    tabItems?: TabItem[];
    onTabPress: (tabName: string) => void;
    backgroundColor?: string;
}

export const BottomNavBar = ({ activeTab, tabItems = defaultTabItems, onTabPress, backgroundColor }: BottomNavBarProps) => {
    const pathname = usePathname();
    const segments = useSegments() as string[];

    const getIconColor = (tabName: string) => {
        const _activeTab = (activeTab || "").split("/")[0];

        // A tab is active if:
        // 1. It matches the explicit activeTab prop
        // 2. Its name is included in the current URL segments
        // 3. The pathname includes the tab name
        const isActive =
            _activeTab === tabName ||
            segments.includes(tabName) ||
            pathname.includes(tabName);

        return isActive ? theme.colors.accent : theme.colors.textWhite;
    };

    return (
        <View style={[styles.container, backgroundColor ? { backgroundColor } : undefined]}>
            {
                tabItems.map((tabItem, index) => (
                    <TouchableOpacity
                        key={`${tabItem.name}-${index}`}
                        style={styles.tab}
                        onPress={() => onTabPress?.(tabItem.name)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome5 name={tabItem.icon as any} size={20} color={getIconColor(tabItem.name)} />
                    </TouchableOpacity>
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: theme.spacing.xs,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
});
