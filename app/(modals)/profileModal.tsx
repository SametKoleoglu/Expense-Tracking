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
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// LOCALE DEFINITIONS
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { Header, ModalWrapper } from "@/components/profile";
import { BackButton, CustomButton, CustomInput, Typo } from "@/components/main";
import { getProfileImage } from "@/services/ImageService";
import { UserDataType } from "@/types";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/userService";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  // STATES
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.name || "",
        image: user?.image || null,
      });
    }
  }, [user]);

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the fields");
      return;
    }

    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);
    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title="Update Profile" leftIcon={<BackButton type="off" />} />

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral700}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <CustomInput
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <CustomButton onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.textLight} fontWeight={"600"}>
            Update
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

export default ProfileModal;
