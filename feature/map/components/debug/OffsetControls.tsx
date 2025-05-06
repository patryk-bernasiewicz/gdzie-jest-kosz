import { StyleSheet, View } from 'react-native';

import useLocation from '@/feature/map/hooks/useLocation';
import TouchableOpacityButton from '@/ui/components/TouchableOpacityButton';
import getColor from '@/ui/utils/getColor';

export default function OffsetControls() {
  const { moveOffsetSouth, moveOffsetNorth, moveOffsetEast, moveOffsetWest, resetOffset } =
    useLocation();

  return (
    <View style={styles.container}>
      <View style={styles.rowCenter}>
        <TouchableOpacityButton onPress={moveOffsetNorth} text="⬆️" />
      </View>
      <View style={styles.rowCenter}>
        <TouchableOpacityButton onPress={moveOffsetWest} text="⬅️" />
        <TouchableOpacityButton onPress={moveOffsetSouth} text="⬇️" />
        <TouchableOpacityButton onPress={moveOffsetEast} text="➡️" />
      </View>
      <View style={styles.rowCenter}>
        <TouchableOpacityButton onPress={resetOffset} text="🔃" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: getColor('background'),
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
