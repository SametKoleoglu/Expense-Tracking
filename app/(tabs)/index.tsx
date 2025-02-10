import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Icons from "phosphor-react-native";

// LOCALE IMPORTS
import { CustomButton, ScreenWrapper, Typo } from "@/components/main";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/context/authContext";
import HomeCard from "@/components/home/HomeCard";
import TransactionList from "@/components/home/TransactionList";
import { router } from "expo-router";

const Home = () => {
  const { user } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ gap: 5 }}>
            <Typo size={15} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(20)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            loading={false}
            emptyListMessage="No Transactions Added yet!"
            title="Recent Transactions"
          />
        </ScrollView>

        <CustomButton
          style={styles.floatingButton}
          onPress={() => {
            router.push("/(modals)/transactionModal");
          }}
        >
          <Icons.Plus
            color={colors.white}
            weight="bold"
            size={verticalScale(23)}
          />
        </CustomButton>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: spacingY._50,
  },
  floatingButton: {
    position: "absolute",
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: 100,
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    gap: spacingY._25,
    marginTop: spacingY._10,
    paddingBottom: verticalScale(50),
  },
});

export default Home;
