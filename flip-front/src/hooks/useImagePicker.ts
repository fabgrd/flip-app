import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
    const [isLoading, setIsLoading] = useState(false);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission requise',
                'Nous avons besoin d\'accéder à votre galerie pour ajouter une photo de profil.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const pickImage = async (): Promise<string | null> => {
        setIsLoading(true);

        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                setIsLoading(false);
                return null;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Format carré pour l'avatar
                quality: 0.7,
            });

            setIsLoading(false);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                return result.assets[0].uri;
            }

            return null;
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image.');
            return null;
        }
    };

    const takePhoto = async (): Promise<string | null> => {
        setIsLoading(true);

        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission requise',
                    'Nous avons besoin d\'accéder à votre caméra pour prendre une photo.',
                    [{ text: 'OK' }]
                );
                setIsLoading(false);
                return null;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1], // Format carré pour l'avatar
                quality: 0.7,
            });

            setIsLoading(false);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                return result.assets[0].uri;
            }

            return null;
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Erreur', 'Impossible de prendre la photo.');
            return null;
        }
    };

    const showImagePicker = (): Promise<string | null> => {
        return new Promise((resolve) => {
            Alert.alert(
                'Ajouter une photo',
                'Choisissez une option',
                [
                    {
                        text: 'Galerie',
                        onPress: async () => {
                            const uri = await pickImage();
                            resolve(uri);
                        },
                    },
                    {
                        text: 'Appareil photo',
                        onPress: async () => {
                            const uri = await takePhoto();
                            resolve(uri);
                        },
                    },
                    {
                        text: 'Annuler',
                        style: 'cancel',
                        onPress: () => resolve(null),
                    },
                ],
                { cancelable: true }
            );
        });
    };

    return {
        isLoading,
        pickImage,
        takePhoto,
        showImagePicker,
    };
}; 