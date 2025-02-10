import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "phosphor-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// LOCALE DEFINITIONS
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { Header, ModalWrapper } from "@/components/profile";
import { BackButton, CustomButton, CustomInput, Typo } from "@/components/main";
import { TransactionType, WalletType } from "@/types";
import { useAuth } from "@/context/authContext";
import ImageUpload from "@/components/wallet/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/WalletService";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { useFetchData } from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";

const TransactionModal = () => {
  const { user } = useAuth();
  // STATES
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  //!!!!! FUNCTIONS
  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  const onSubmit = () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields below");
    }

    console.log("good to go");
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };
    console.log("transaction data", transactionData);
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet?\nThis action will remove all the transactions related to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton type="off" />}
        />

        {/* FORM */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* DROPDOWNS */}
          {/* TYPES */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={15}>
              Type
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral500}
              // placeholder={!isFocus ? "Select item" : "..."}
              // searchPlaceholder="Search..."
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>
          {/* WALLET TYPES */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={15}>
              Wallet
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral500}
              placeholder={"Select wallet"}
              // searchPlaceholder="Search..."
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({
                  ...transaction,
                  walletId: item.value || "",
                });
              }}
            />
          </View>
          {/* EXPENSE CATEGORY */}
          {transaction.type == "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={15}>
                Expense Category
              </Typo>
              <Dropdown
                style={styles.dropdownContainer}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                activeColor={colors.neutral500}
                placeholder={"Select category"}
                // searchPlaceholder="Search..."
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          {/* DATE PICKER */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={15}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={13}>
                  {(transaction.date as Date).toLocaleDateString("en-US")}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={14} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* AMOUNT  */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={15}>
              Amount
            </Typo>
            <CustomInput
              // placeholder="Salary"
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9.]/g, "")),
                })
              }
            />
          </View>

          {/* DESCRIPTION  */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={15}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={13}>
                (Optional)
              </Typo>
            </View>
            <CustomInput
              value={transaction.description}
              multiline
              containerStyle={{
                alignItems: "flex-start",
                height: verticalScale(100),
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          {/* TRANSACTION ICON */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={15}>
                Receipt
              </Typo>
              <Typo color={colors.neutral500} size={13}>
                (Optional)
              </Typo>
            </View>
            <ImageUpload
              placeholder="Image Upload"
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        {!loading && oldTransaction?.id && (
          <CustomButton
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(23)}
              weight="bold"
            />
          </CustomButton>
        )}
        <CustomButton onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.textLight} fontWeight={"600"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </CustomButton>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(12),
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
    borderTopColor: colors.neutral600,
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
    right: 12,
    borderRadius: 50,
    elevation: 5,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(55),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._5,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
    marginRight: spacingX._5,
  },
  dropdownContainer: {
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.green,
    fontSize: verticalScale(15),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: spacingX._5,
    borderColor: colors.rose,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: spacingY._10,
    elevation: spacingX._5,
  },
  dropdownPlaceholder: {
    color: colors.primary,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._5,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.green,
  },
});

export default TransactionModal;
