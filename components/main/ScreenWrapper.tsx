import { View, Text, Platform, Dimensions, StatusBar } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.07 : 0;
  return (
    <View
      style={[style, { paddingTop, flex: 1, backgroundColor: colors.black }]}
    >
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.neutral900}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;
