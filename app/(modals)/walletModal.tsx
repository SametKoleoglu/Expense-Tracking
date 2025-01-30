import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// LOCALE DEFINITIONS
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { Header, ModalWrapper } from "@/components/profile";
import { BackButton, CustomButton, CustomInput, Typo } from "@/components/main";
import { WalletType } from "@/types";
import { useAuth } from "@/context/authContext";
import ImageUpload from "@/components/wallet/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/WalletService";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  // STATES
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
  }, []);
  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet?.id;
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
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
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton type="off" />}
        />

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.form}>
          {/* INPUT AREA */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <CustomInput
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              placeholder="Image Upload"
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        {!loading && oldWallet?.id && (
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
            {oldWallet?.id ? "Update Wallet" : "Create Wallet"}
          </Typo>
        </CustomButton>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
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
  form: {
    marginTop: spacingY._15,
    gap: spacingY._30,
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
});

export default WalletModal;
