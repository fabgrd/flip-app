import * as ImagePicker from 'expo-image-picker';
import { t } from 'i18next';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('errors.permissionRequired'));
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
        mediaTypes: ['images'],
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
      Alert.alert(t('errors.imageSelectionFailed'));
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    setIsLoading(true);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionRequired'));
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
      Alert.alert(t('errors.photoTakingFailed'));
      return null;
    }
  };

  const showImagePicker = (): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        t('errors.addPhoto'),
        t('chooseOption'),
        [
          {
            text: t('errors.gallery'),
            onPress: async () => {
              const uri = await pickImage();
              resolve(uri);
            },
          },
          {
            text: t('errors.camera'),
            onPress: async () => {
              const uri = await takePhoto();
              resolve(uri);
            },
          },
          {
            text: t('errors.cancel'),
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true },
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
