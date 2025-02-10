import { View, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import * as Icons from "phosphor-react-native";

// LOCALE IMPORTS
import { Typo } from "../main";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

const HomeCard = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* TOTAL BALANCE */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral700} size={16} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutline
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo fontWeight={"bold"} color={colors.black} size={30}>
            1,000.00$
          </Typo>
        </View>

        {/* EXPENSE AND INCOME */}
        <View style={styles.stats}>
          {/* INCOME */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.green}
                  weight="bold"
                />
              </View>
              <Typo size={15} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={16} color={colors.green} fontWeight={"bold"}>
                2323$
              </Typo>
            </View>
          </View>
          {/* EXPENSE */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.green}
                  weight="bold"
                />
              </View>
              <Typo size={15} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={16} color={colors.rose} fontWeight={"bold"}>
                23234$
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    width: "100%",
    height: scale(200),
  },
  container: {
    width: "100%",
    height: "85%",
    justifyContent: "space-between",
    padding: spacingX._20,
    paddingHorizontal: scale(23),
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: spacingY._50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});

export default HomeCard;
