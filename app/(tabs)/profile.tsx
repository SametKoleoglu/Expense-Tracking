import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";

// LOCALE DEFINITIONS
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/authContext";
import {
  BackButton,
  CustomButton,
  ScreenWrapper,
  Typo,
} from "@/components/main";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/profile/Header";
import { getProfileImage } from "@/services/ImageService";
import { accountOptionType } from "@/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { accountOptions } from "@/constants/data";
import { Alert } from "react-native";
import { router } from "expo-router";

const Profile = () => {
  const { user } = useAuth();
  const handleSignout = async () => {
    await signOut(auth);
  };

  const showSignoutAlert = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Sign Out",
        onPress: () => handleSignout(),
        style: "destructive",
      },
    ]);
  };
  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Sign Out") {
      showSignoutAlert();
    }

    if (item.routeName) router.push({ pathname: item.routeName });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />
        {/* USER DATA */}
        <View style={styles.userInfo}>
          {/* AVATAR */}
          <View>
            {/* IMAGE */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              transition={100}
              contentFit="cover"
            />
          </View>
          {/* NAME & EMAIL */}
          <View style={styles.nameContainer}>
            <Typo size={23} color={colors.neutral200} fontWeight={"600"}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral200}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* ACCOUNT OPTIONS */}
        <View style={styles.accountOptionsContainer}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  {/* ICON */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo style={{ flex: 1 }} size={15} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.neutral100}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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
  userInfo: {
    alignItems: "center",
    marginTop: verticalScale(30),
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    width: verticalScale(135),
    height: verticalScale(135),
    alignSelf: "center",
    backgroundColor: colors.neutral350,
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    padding: 5,
    bottom: 5,
    right: 10,
    borderRadius: 50,
    elevation: 5,
  },
  nameContainer: {
    alignItems: "center",
    gap: verticalScale(5),
  },
  listIcon: {
    width: verticalScale(45),
    height: verticalScale(45),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(15),
  },
  accountOptionsContainer: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});

export default Profile;
