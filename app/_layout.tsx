import { router, Stack, usePathname } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const { width, height } = Dimensions.get("screen");
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const homeRoute = () => {
    setShowDropdown(false);
    router.replace("/home");
  };
  const categoryRoute = () => {
    setShowDropdown(false);
    router.replace("/category");
  };
  const itemRoute = () => {
    setShowDropdown(false);
    router.replace("/item");
  };

  return (
    <>
      {/* Header (hidden only on login) */}
      {pathname !== "/login" && pathname !== "/" && (
        <View
          style={{
            backgroundColor: "#198754",
            width,
            height: height * 0.1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            zIndex: 100, // keep above page content
          }}
        >
          {/* Title */}
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontFamily: "Poppins-ExtraBold",
            }}
          >
            KRSS Mart
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Master button */}
            <View style={{ position: "relative", marginRight: 20 }}>
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontFamily: "Poppins-ExtraBold",
                    borderBottomWidth: 2,
                    borderBottomColor: "#D6F4C3",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  Master
                </Text>
              </TouchableOpacity>

              {/* Dropdown */}
              {showDropdown && (
                <View
                  style={{
                    position: "absolute",
                    top: 35,
                    right: 0,
                    backgroundColor: "white",
                    borderRadius: 6,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 5,
                    minWidth: 140,
                    zIndex: 200, // ensures dropdown overlays everything
                  }}
                >
                  <TouchableOpacity
                    onPress={categoryRoute}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#ddd",
                    }}
                  >
                    <Text
                      style={{
                        color: "#198754",
                        fontFamily: "Poppins-ExtraBold",
                        textAlign: "center",
                      }}
                    >
                      Categories
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={itemRoute} style={{ padding: 10 }}>
                    <Text
                      style={{
                        color: "#198754",
                        fontFamily: "Poppins-ExtraBold",
                        textAlign: "center",
                      }}
                    >
                      Items
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Home button */}
            <TouchableOpacity onPress={homeRoute}>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontFamily: "Poppins-ExtraBold",
                  borderBottomWidth: 2,
                  borderBottomColor: "#D6F4C3",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Page stack */}
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar hidden={true} />
    </>
  );
}
