import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";

// LOCALE DEFINITIONS
import { TransactionItemProps, TransactionListType } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Loading, Typo } from "../main";
import { expenseCategories } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = () => {};
  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>

      {!loading && data?.length == 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
      <Text>TransactionList</Text>
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category = expenseCategories["utilities"];
  const IconComponent = category.icon;
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(23)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={16}>{category.label}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            paid wifi bill
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo fontWeight={"500"} color={colors.rose} size={16}>
            -100$
          </Typo>
          <Typo size={12} color={colors.neutral400}>
            Feb 12
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacingY._15,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(40),
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});

export default TransactionList;
