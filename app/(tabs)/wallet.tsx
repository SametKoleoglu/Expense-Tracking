import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";

// LOCALE
import { Loading, ScreenWrapper, Typo } from "@/components/main";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useFetchData } from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import WalletItem from "@/components/wallet/WalletItem";

const Wallet = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const getBalanceTotal = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={35} fontWeight={"600"}>
              {getBalanceTotal()?.toFixed(2)}₺
            </Typo>
            <Typo size={15} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>

        {/* WALLETS */}
        <View style={styles.wallets}>
          {/* HEADER */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"600"}>
              Wallets my
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(30)}
              />
            </TouchableOpacity>
          </View>

          {/* LOADING  */}
          {loading && <Loading />}

          {/* WALLET LIST */}
          {!loading && !error && wallets.length > 0 && (
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id as string}
              renderItem={({ item, index }) => (
                <WalletItem item={item} key={index} index={index} />
              )}
              contentContainerStyle={styles.listStyle}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(150),
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    padding: spacingX._20,
    paddingTop: spacingX._25,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});

export default Wallet;
