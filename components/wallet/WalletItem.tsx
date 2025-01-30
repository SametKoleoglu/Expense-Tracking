import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";

// LOCALE IMPORTS
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { Typo } from "../main";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";

const WalletItem = ({ item, index }: { item: WalletType; index: number }) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 250)
        .springify()
        .damping(12)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item.name}</Typo>
          <Typo size={15} color={colors.neutral500}>
            {item.amount} ₺
          </Typo>
        </View>

        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(15),
    padding: spacingX._5,
  },
  imageContainer: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral700,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    marginLeft: spacingX._10,
  },
});

export default WalletItem;
