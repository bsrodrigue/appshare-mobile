import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { theme } from '@/ui/theme';

interface Category {
    id: number;
    name: string;
    color?: string;
}

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: number;
    onCategorySelect: (categoryId: number) => void;
}

const activeCategoryColor = '#FF6B35'
const inactiveCategoryColor = '#00A8E8'

export const CategoryTabs = ({
    categories,
    activeCategory,
    onCategorySelect,
}: CategoryTabsProps) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const isActive = category.id === activeCategory;
                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab,
                                category.color && { backgroundColor: category.color },
                            ]}
                            onPress={() => onCategorySelect(category.id)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isActive && styles.activeTabText,
                                ]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 4,
    },
    tab: {
        paddingHorizontal: 20,
        backgroundColor: inactiveCategoryColor,
        borderWidth: 1,
        borderColor: inactiveCategoryColor,
    },
    activeTab: {
        backgroundColor: activeCategoryColor,
        borderColor: activeCategoryColor,
    },
    tabText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
