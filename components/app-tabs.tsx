import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

const AppTabs = () => (
  <NativeTabs backgroundColor="#ffffff" indicatorColor="#F0F0F3">
    <NativeTabs.Trigger name="index">
      <NativeTabs.Trigger.Label>채팅</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="bubble.fill" md="chat_bubble" renderingMode="template" />
    </NativeTabs.Trigger>

    <NativeTabs.Trigger name="accounts">
      <NativeTabs.Trigger.Label>주소록</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="person.3.fill" md="person_3" renderingMode="template" />
    </NativeTabs.Trigger>

    <NativeTabs.Trigger name="profile">
      <NativeTabs.Trigger.Label>내 정보</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="person.fill" md="person" renderingMode="template" />
    </NativeTabs.Trigger>
  </NativeTabs>
);

export default AppTabs;
