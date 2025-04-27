import { useAuthToken } from "@/store/authToken.atom";
import { useAtomValue } from "jotai";
import { View } from "react-native";
import Text from "@/components/ui/Text";
import { getColor } from "@/lib/getColor";
import useDevMode from "@/hooks/useDevMode";

export default function TokenDebug() {
  const [token] = useAuthToken();
  const isDevMode = useDevMode();

  if (!isDevMode) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: getColor("background"),
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        position: "absolute",
        top: 110,
        right: 20,
      }}
      onTouchEnd={() => console.log(`Token: ${token}`)}
    >
      <Text>Token:</Text>
      <Text>{token?.length ? `${token.slice(0, 13)}...` : "-"}</Text>
    </View>
  );
}
