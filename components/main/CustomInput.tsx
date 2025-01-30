import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { EyeSlash, EyeClosed, HandEye } from "phosphor-react-native";

// LOCALE IMPORTS
import { InputProps } from "@/types";
import { colors, radius, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const CustomInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      style={[props.containerStyle && props.containerStyle, styles.container]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[props.inputStyle, styles.input]}
        {...props}
        secureTextEntry={props.secureTextEntry && !showPassword}
        placeholderTextColor={colors.neutral400}
        selectionColor={colors.primary}
        ref={props.inputRef && props.inputRef}
      />
      {props.secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <HandEye color={colors.textLighter} />
          ) : (
            <EyeSlash color={colors.rose} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(50),
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: verticalScale(16),
  },
});

export default CustomInput;
