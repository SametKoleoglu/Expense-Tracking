import React from "react";
import { Tabs } from "expo-router";
import CustomTabs from "@/components/Layout/CustomTabs";

const TabLayout = () => {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabLayout;
