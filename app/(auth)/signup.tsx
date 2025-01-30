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

const Signup = () => {
  const { register: registerUser } = useAuth();
  // REFS
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  //   STATES
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const response = await registerUser(
      nameRef.current,
      emailRef.current,
      passwordRef.current
    );
    setIsLoading(false);
    console.log("Register Result", response);
    if (!response.success) {
      if (response.msg?.includes("email-already-in-use")) {
        Alert.alert("Sign Up Failed", "Email already in use");
      } else if (response.msg?.includes("Password should be")) {
        Alert.alert("Sign Up Failed", "Please enter a valid password");
      } else {
        Alert.alert("Sign Up Failed", response.msg);
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={styles.subContainer}>
          <Typo fontWeight={"700"} size={28}>
            Let's
          </Typo>
          <Typo fontWeight={"700"} size={28}>
            Get Started
          </Typo>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>
          {/* INPUT */}
          <CustomInput
            placeholder="Name"
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.User
                size={verticalScale(24)}
                color={colors.primary}
                weight="fill"
              />
            }
          />
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

          {/* BUTTON */}
          <CustomButton loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"600"} color={colors.black} size={20}>
              Sign Up
            </Typo>
          </CustomButton>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Typo size={14}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/signin")}>
            <Typo size={14} fontWeight={"bold"} color={colors.primary}>
              Sign In
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
    marginVertical: spacingY._20,
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

export default Signup;
