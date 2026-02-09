import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/ui/theme';
import { SelectInput } from '@/ui/use-cases/shared/components/inputs/SelectInput';
import { NumberInput } from '@/ui/use-cases/shared/components/inputs/NumberInput';
import { Button } from '@/ui/use-cases/shared/components/inputs/Button';
import * as ImagePicker from 'expo-image-picker';
import { useUpdateProduct } from '@/features/products/hooks';
import { SellerProductResource } from '@/features/products/types';
import { Toaster } from '@/libs/notification/toast';

interface EditProductModalProps {
    visible: boolean;
    onClose: () => void;
    product: SellerProductResource | null;
    onSuccess: () => void;
}

// Reuse mock categories for consistency
const MOCK_CATEGORIES = [
    { id: 1, name: 'Téléviseur' },
    { id: 2, name: 'Électroménager' },
    { id: 3, name: 'Informatique' },
    { id: 4, name: 'Mode' },
];

export const EditProductModal = ({ visible, onClose, product, onSuccess }: EditProductModalProps) => {
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('01');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [articleName, setArticleName] = useState('');

    useEffect(() => {
        if (product) {
            setDescription(product.description || '');
            setQuantity(product.quantity.toString().padStart(2, '0'));
            setPrice(product.price.toString());
            setImage(product.image_url);
            setCategoryId(product.category?.id || null);
            setArticleName(product.name);
        }
    }, [product]);

    const { updateProduct, isLoading } = useUpdateProduct({
        onSuccess: () => {
            Toaster.success('Succès', 'Article modifié avec succès');
            onSuccess();
            onClose();
        },
        onError: (err) => Toaster.error('Erreur', err)
    });

    const selectedCategory = useMemo(() =>
        MOCK_CATEGORIES.find(c => c.id === categoryId), [categoryId]
    );

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
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
                onPress: () => setCategoryId(c.id)
            })).concat([{ text: 'Annuler', style: 'cancel' } as any])
        );
    };

    const handleUpdate = async () => {
        if (!product) return;
        if (!categoryId || !articleName || !price || !quantity) {
            Toaster.error('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        const imagePayload = (image && !image.startsWith('http')) ? {
            uri: image,
            name: image.split('/').pop() || `product_${Date.now()}.jpg`,
            type: 'image/jpeg',
        } : undefined;

        console.log('Image upload debug:', {
            hasImage: !!image,
            isNewImage: image && !image.startsWith('http'),
            imageUri: image,
            imagePayload
        });

        const payload = {
            id: product.id,
            category_id: categoryId,
            name: articleName,
            description: description,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            // Wrap single image in array as API expects images array
            images: imagePayload ? [imagePayload] : undefined,
        };

        await updateProduct(payload);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>MODIFIER L'ARTICLE</Text>
                        <TouchableOpacity onPress={onClose} disabled={isLoading}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form}>
                        <Text style={styles.label}>Catégorie</Text>
                        <SelectInput
                            label="Catégorie"
                            value={selectedCategory?.name}
                            onPress={handleCategorySelect}
                        />

                        <Text style={styles.label}>Article</Text>
                        <TextInput
                            style={styles.articleInput}
                            placeholder="Nom de l'article"
                            value={articleName}
                            onChangeText={setArticleName}
                            editable={!isLoading}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Décrivez votre article"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            editable={!isLoading}
                        />

                        <Text style={styles.label}>Prix (CFA)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="pricetag-outline" size={16} color={theme.colors.placeholder} />
                            <TextInput
                                style={styles.priceInput}
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                                editable={!isLoading}
                            />
                        </View>

                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Quantité</Text>
                                <NumberInput value={quantity} onChangeText={setQuantity} />
                            </View>

                            <TouchableOpacity
                                style={styles.imagePicker}
                                onPress={pickImage}
                                disabled={isLoading}
                            >
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="image" size={32} color={theme.colors.disabled} />
                                    </View>
                                )}
                                <View style={styles.changeOverlay}>
                                    <Text style={styles.changeText}>CHANGER PHOTO</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Button
                            title={isLoading ? "" : "ENREGISTRER LES MODIFICATIONS"}
                            onPress={handleUpdate}
                            style={styles.saveButton}
                            disabled={isLoading}
                        >
                            {isLoading && <ActivityIndicator color="#fff" />}
                        </Button>
                        <View />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textLight,
        marginBottom: 8,
        marginTop: 10,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 48,
    },
    priceInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    articleInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 48,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    imagePicker: {
        flex: 1,
        marginLeft: 20,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 4,
        alignItems: 'center',
    },
    changeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 30,
        paddingHorizontal: "auto"
    },
});
