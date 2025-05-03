import useLocation from '@/feature/map/hooks/useLocation';
import { getColor } from '@/lib/getColor';
import { View, StyleSheet } from 'react-native';
import TouchableOpacityButton from '@/components/ui/TouchableOpacityButton';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1,
    backgroundColor: getColor('background'),
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

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
