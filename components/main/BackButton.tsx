import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { router } from "expo-router";
import { CaretLeft, X } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";

const BackButton = ({
  style,
  iconSize = 25,
  type = "back",
}: BackButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[style, styles.button]}
    >
      {type === "back" ? (
        <CaretLeft
          size={verticalScale(iconSize)}
          color={colors.text}
          weight="bold"
        />
      ) : (
        <X size={verticalScale(iconSize)} color={colors.text} weight="bold" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});

export default BackButton;
