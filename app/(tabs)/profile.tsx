import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { getAuth, updateProfile } from '@react-native-firebase/auth';

import Avatar from '@/components/ui/avatar';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { signOut } from '@/features/auth/api/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '@/features/profile/api';

const Profile = () => {
  const auth = getAuth();
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();

  const [photoUrl, setPhotoUrl] = useState(user?.photoURL);

  const handleLogoutButtonPress = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('SignOut Error:', error);
    }
  };

  const handlePhotoChange = async () => {
    if (!auth.currentUser) return;
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setPhotoUrl(result.assets[0].uri);
        await updateProfile(auth.currentUser, { photoURL: result.assets[0].uri });
      } catch (error) {
        console.error('Photo Change Error:', error);
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Pressable onPress={handlePhotoChange}>
        <Avatar src={photoUrl ?? null} size={100} />
      </Pressable>
      <Input label="이름" value={user?.displayName || ''} disabled />
      <Input label="이메일" value={user?.email || ''} disabled />
      <Input label="계좌번호" value={profile?.account ?? ''} disabled />
      <Button label="로그아웃" onPress={handleLogoutButtonPress} variant="default" size="default" />
    </View>
  );
};

export default Profile;
