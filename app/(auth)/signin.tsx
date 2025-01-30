import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import * as Icons from "phosphor-react-native";

// LOCALE IMPORTS
import {
  BackButton,
  CustomButton,
  CustomInput,
  ScreenWrapper,
  Typo,
} from "@/components/main";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { useAuth } from "@/context/authContext";

const Signin = () => {
  const { login: loginUser } = useAuth();

  // REFS
  const emailRef = useRef("");
  const passwordRef = useRef("");

  //   STATES
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please enter your email and password");
      return;
    }
    setIsLoading(true);
    const response = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);

    if (!response.success) {
      if (response.msg?.includes("invalid-email")) {
        Alert.alert("Sign In Failed", "Please enter a valid email address");
      } else if (response.msg?.includes("invalid-credential")) {
        Alert.alert("Sign In Failed", "Invalid credentials");
      } else {
        Alert.alert("Sign In Failed", response.msg);
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={styles.subContainer}>
          <Typo fontWeight={"700"} size={28}>
            Hey, Dear
          </Typo>
          <Typo fontWeight={"700"} size={28}>
            Welcome Back
          </Typo>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Signin now to track all your expenses
          </Typo>
          {/* INPUT */}
          <CustomInput
            placeholder="Email Address"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.At
                size={verticalScale(24)}
                color={colors.primary}
                weight="fill"
              />
            }
          />
          <CustomInput
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.Lock
                size={verticalScale(24)}
                color={colors.primary}
                weight="fill"
              />
            }
          />
          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password
          </Typo>

          {/* BUTTON */}
          <CustomButton loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"600"} color={colors.black} size={20}>
              Sign In
            </Typo>
          </CustomButton>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Typo size={14}>Don't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/signup")}>
            <Typo size={14} fontWeight={"bold"} color={colors.primary}>
              Sign Up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  subContainer: {
    gap: 5,
    marginTop: spacingY._20,
  },
  welcomeText: {
    color: colors.text,
    fontSize: verticalScale(20),
    fontWeight: "bold",
  },
  form: {
    gap: spacingY._20,
    marginBottom: spacingY._20,
  },
  forgotPassword: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._10,
  },
  footerText: {
    textAlign: "center",
    fontSize: verticalScale(14),
    color: colors.text,
  },
});

export default Signin;
