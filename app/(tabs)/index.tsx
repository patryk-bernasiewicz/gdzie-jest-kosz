import { StyleSheet, Text, View } from "react-native";

import LeafletMap from "@/components/LeafletMap";

import useLocation from "@/hooks/useLocation";
import useUserProfile from "@/hooks/useUserProfile";

export default function HomeScreen() {
  const { location } = useLocation();
  const userProfile = useUserProfile();

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <LeafletMap latitude={location?.[0]} longitude={location?.[1]} />
      </View>
      {userProfile.data && userProfile.data.role === "admin" ? (
        <View style={styles.position}>
          <Text>
            Current position:{"\n"}
            {location ? `${location[0]}\n${location[1]}` : "none"}
            {"\n"}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "#f00",
    borderStyle: "solid",
    width: "100%",
  },
  position: {
    position: "absolute",
    bottom: 120,
    left: 20,
    zIndex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#f00",
    borderStyle: "solid",
    padding: 10,
    borderRadius: 5,
  },
});
