import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import * as Icons from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";

import { ImageUploadProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { Typo } from "../main";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { getFilePath } from "@/services/ImageService";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };
  return (
    <View>
      {!file && (
        <TouchableOpacity
          style={[styles.inputContainer, containerStyle && containerStyle]}
          onPress={pickImage}
        >
          <Icons.UploadSimple color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            contentFit="cover"
            transition={100}
            source={getFilePath(file)}
          />
          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <Icons.XCircle
              size={verticalScale(23)}
              weight="fill"
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.neutral700,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: radius._15,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
    height: verticalScale(50),
  },
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(5),
    right: scale(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default ImageUpload;
