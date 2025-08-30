// screens/AccountScreen.js
import React, { memo } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "../helper/routes";

const Icons = {
  back: require("../assets/backButtonImage.png"),
  vector: require("../assets/images/vector.png"),
  chevronRight: require("../assets/accountImages/chevronRight.png"),
};

const AccountImages = {
  myOrders: require("../assets/accountImages/myOrderImage.png"),
  myDetails: require("../assets/accountImages/myDetailImage.png"),
  addressBook: require("../assets/accountImages/addressImage.png"),
  paymentMethods: require("../assets/accountImages/cardImage.png"),
  notifications: require("../assets/images/vector.png"),
  faq: require("../assets/accountImages/faqImage.png"),
  helpCenter: require("../assets/accountImages/helpCenterImage.png"),
  logout: require("../assets/accountImages/logoutImage.png"),
};

const ACCOUNT_SECTIONS = [
  {
    title: "Main",
    data: [{ title: "My Orders", icon: AccountImages.myOrders }],
  },
  {
    title: "Profile",
    data: [
      { title: "My Details", icon: AccountImages.myDetails },
      { title: "Address Book", icon: AccountImages.addressBook },
      { title: "Payment Methods", icon: AccountImages.paymentMethods },
      { title: "Notifications", icon: AccountImages.notifications },
    ],
  },
  {
    title: "Support",
    data: [
      { title: "FAQs", icon: AccountImages.faq },
      { title: "Help Center", icon: AccountImages.helpCenter },
    ],
  },
  {
    title: "Logout",
    data: [{ title: "Logout", icon: AccountImages.logout, isLogout: true }],
  },
];

const AccountItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    style={[styles.item, item.isLogout && styles.logoutItem]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.itemLeft}>
      <Image
        source={item.icon}
        style={[styles.icon, item.isLogout && styles.logoutIcon]}
      />
      <Text style={[styles.title, item.isLogout && styles.logoutText]}>
        {item.title}
      </Text>
    </View>
    {!item.isLogout && (
      <Image source={Icons.chevronRight} style={styles.chevron} />
    )}
  </TouchableOpacity>
));

const AccountScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <AccountItem
      item={item}
      onPress={() => {
        if (item.isLogout) {
          // TODO: handle logout
        } else if (item.title === "My Orders") {
        navigation.navigate(ROUTES.MY_ORDERS);
      } else if (item.title === "Payment Methods") {
        navigation.navigate(ROUTES.NEWCARD_SCREEN);
      } else {
        console.log("Navigate to:", item.title);
      }
      }}
    />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Icons.back} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity>
          <Image source={Icons.vector} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={ACCOUNT_SECTIONS}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: "#000",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 14,
    resizeMode: "contain",
    tintColor: "#444",
  },
  chevron: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    tintColor: "#444",
  },
  separator: {
    height: 0,
  },
  logoutItem: {
    borderWidth: 1,
    borderColor: "#eee",
  },
  logoutText: {
    color: "red",
    fontWeight: "600",
  },
  logoutIcon: {
    tintColor: "red",
  },
});

export default AccountScreen;
