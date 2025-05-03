import { Fragment, useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Text from '@/components/ui/Text';
import { getColor } from '@/lib/getColor';

type MapContextMenuProps = {
  screenX?: number | null;
  screenY?: number | null;
  isOpen: boolean;
  padding?: number;
  onCreateBin: () => void;
  disabled?: boolean;
  selectedBinIds?: number[];
  onMarkInvalidBin: () => void;
};

const defaultPadding = 30;

export default function MapContextMenu({
  screenX,
  screenY,
  isOpen,
  padding = defaultPadding,
  onCreateBin,
  disabled = false,
  selectedBinIds = [],
  onMarkInvalidBin,
}: MapContextMenuProps) {
  const menuPosY = screenY ? screenY + padding : padding;
  const menuPosX = useMemo(() => {
    const maxX = Dimensions.get('window').width - 150 - padding;
    return screenX ? Math.min(maxX, screenX) : maxX;
  }, [padding, screenX]);

  if (!isOpen) {
    return null;
  }

  return (
    <TouchableWithoutFeedback
      onPress={(event) => {
        event.persist();
      }}
    >
      <View
        style={[
          {
            ...styles.contextMenu,
            top: menuPosY,
            left: menuPosX,
          },
          disabled && styles.contextMenuDisabled,
        ]}
      >
        <Text onPress={onCreateBin} disabled={disabled}>
          Tu jest kosz!
        </Text>
        {selectedBinIds?.map((binId) => (
          <Fragment key={binId}>
            <View style={styles.separator} />
            <Text onPress={() => onMarkInvalidBin()}>Kosz ID: {binId} - nieaktualny?</Text>
          </Fragment>
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contextMenu: {
    position: 'absolute',
    backgroundColor: getColor('background'),
    padding: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    width: 150,
  },
  contextMenuDisabled: {
    backgroundColor: getColor('backgroundDim'),
    pointerEvents: 'none',
  },
  separator: {
    height: 1,
    backgroundColor: getColor('border'),
    marginVertical: 5,
  },
});
