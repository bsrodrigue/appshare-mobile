import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { SectionHeader } from '@/ui/use-cases/shared/components/SectionHeader';
import { SelectInput } from '@/ui/use-cases/shared/components/inputs/SelectInput';
import { NumberInput } from '@/ui/use-cases/shared/components/inputs/NumberInput';
import { Button } from '@/ui/use-cases/shared/components/inputs/Button';
import * as ImagePicker from 'expo-image-picker';
import { useCreateProduct } from '@/features/products/hooks';
import { Toaster } from '@/libs/notification/toast';

// Mock categories for the demonstration
const MOCK_CATEGORIES = [
    { id: 1, name: 'Téléviseur' },
    { id: 2, name: 'Électroménager' },
    { id: 3, name: 'Informatique' },
    { id: 4, name: 'Mode' },
];

const MOCK_ARTICLES: Record<number, string[]> = {
    1: ['Samsung Smart TV 55"', 'LG OLED 65"', 'Sony Bravia 50"'],
    2: ['Réfrigérateur', 'Machine à laver', 'Micro-ondes'],
    3: ['MacBook Pro', 'Clavier Gamer', 'Souris Sans Fil'],
    4: ['Sacs à dos', 'Chaussures', 'T-shirt'],
};

export const CreateArticleSection = React.forwardRef((props, ref) => {
    const descriptionRef = React.useRef<TextInput>(null);
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('01');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [articleName, setArticleName] = useState('');

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            descriptionRef.current?.focus();
        }
    }));

    const selectedCategory = useMemo(() =>
        MOCK_CATEGORIES.find(c => c.id === categoryId), [categoryId]
    );

    const { createProduct, isLoading } = useCreateProduct({
        onSuccess: () => {
            Toaster.success('Succès', 'Article publié avec succès!');
            resetForm();
        },
        onError: (err) => {
            Toaster.error('Erreur', err);
        }
    });

    const resetForm = () => {
        setDescription('');
        setQuantity('01');
        setPrice('');
        setImage(null);
        setCategoryId(null);
        setArticleName('');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCategorySelect = () => {
        Alert.alert(
            'Choisir une catégorie',
            '',
            MOCK_CATEGORIES.map(c => ({
                text: c.name,
                onPress: () => {
                    setCategoryId(c.id);
                    setArticleName(''); // Reset article when category changes
                }
            })).concat([{ text: 'Annuler', style: 'cancel' } as any])
        );
    };

    const handleArticleSelect = () => {
        if (!categoryId) {
            Toaster.error('Information', 'Veuillez choisir une catégorie d\'abord');
            return;
        }

        const articles = MOCK_ARTICLES[categoryId] || [];
        Alert.alert(
            'Choisir un article',
            '',
            articles.map(a => ({
                text: a,
                onPress: () => setArticleName(a)
            })).concat([{ text: 'Annuler', style: 'cancel' } as any])
        );
    };

    const handlePublish = async () => {
        if (!categoryId || !articleName || !price || !quantity) {
            Toaster.error('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        const payload = {
            category_id: categoryId,
            name: articleName,
            description: description,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            image: image ? {
                uri: image,
                name: 'image.jpg',
                type: 'image/jpeg',
            } as any : undefined,
        };

        await createProduct(payload);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <SectionHeader
                title="PUBLIER UN ARTICLE"
            />

            {/* Description Input */}
            <TextInput
                ref={descriptionRef}
                style={styles.descriptionInput}
                placeholder="Décrivez votre articles"
                placeholderTextColor={theme.colors.placeholder}
                multiline
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
            />

            {/* Price Input (New) */}
            <View style={styles.priceContainer}>
                <Ionicons name="pricetag-outline" size={16} color={theme.colors.placeholder} />
                <TextInput
                    style={styles.priceInput}
                    placeholder="Prix (ex: 150000)"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    editable={!isLoading}
                />
                <Text style={styles.currency}>CFA</Text>
            </View>

            {/* Form Controls Row */}
            <View style={styles.controlsRow}>
                <SelectInput
                    label="Catégorie"
                    value={selectedCategory?.name}
                    onPress={handleCategorySelect}
                    style={{ minWidth: 100 }}
                />
                <SelectInput
                    label="Article"
                    value={articleName}
                    onPress={handleArticleSelect}
                    style={{ minWidth: 80 }}
                />
                <NumberInput
                    value={quantity}
                    onChangeText={setQuantity}
                />

                <TouchableOpacity
                    style={[styles.photoButton, { flexGrow: 1 }]}
                    onPress={pickImage}
                    disabled={isLoading}
                >
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="image" size={24} color={theme.colors.disabled} />
                        </View>
                    )}
                    <Text style={styles.photoLabel}>PHOTO</Text>
                </TouchableOpacity>
            </View>

            {/* Publish Button */}
            <View style={styles.footer}>
                <Button
                    title={isLoading ? "" : "PUBLIER"}
                    onPress={handlePublish}
                    style={styles.publishButton}
                    disabled={isLoading}
                >
                    {isLoading && <ActivityIndicator color="#fff" />}
                </Button>
            </View>
        </View>
    );
});

CreateArticleSection.displayName = 'CreateArticleSection';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    descriptionInput: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        minHeight: 40,
        marginVertical: theme.spacing.sm,
        textAlignVertical: 'top',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        paddingHorizontal: theme.spacing.sm,
        height: 36,
        marginBottom: theme.spacing.md,
    },
    priceInput: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        marginLeft: 8,
    },
    currency: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.placeholder,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing.lg,
        flexWrap: 'wrap',
        gap: 10,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2,
    },
    photoPlaceholder: {
        width: 32,
        height: 32,
        backgroundColor: theme.colors.inputBackground,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    previewImage: {
        width: 32,
        height: 32,
        borderRadius: 4,
        marginRight: 6,
    },
    photoLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    footer: {
        alignItems: 'flex-end',
    },
    publishButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        minWidth: 100,
        borderRadius: theme.borderRadius.sm,
        height: 40,
        justifyContent: 'center',
    },
});
