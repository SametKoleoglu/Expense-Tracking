import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CustomButton, ScreenWrapper, Typo } from "@/components/main";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Signin button & image */}
        <View>
          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("@/assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={styles.subFooter1}
          >
            <Typo size={28} fontWeight={"700"}>
              Always Take Control
            </Typo>
            <Typo size={24} fontWeight={"600"}>
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={styles.subFooter2}
          >
            <Typo size={16} color={colors.textLight}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={16} color={colors.textLight}>
              lifestyle in future
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}
          >
            {/* BUTTON */}
            <CustomButton onPress={() => router.push("/(auth)/signin")}>
              <Typo fontWeight={"bold"} size={20}>
                Get Started
              </Typo>
            </CustomButton>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    marginTop: verticalScale(100),
    alignSelf: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    gap: spacingY._20,
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: -14,
    },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  subFooter1: {
    alignItems: "center",
    gap: spacingY._5,
  },
  subFooter2: { alignItems: "center", gap: spacingX._3 },
});
