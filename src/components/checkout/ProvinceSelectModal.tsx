import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CheckIcon } from '@/components/ui/Icons';
import { Palette } from '@/constants/theme';
import { ARGENTINE_PROVINCES } from '@/utils/validation';

export interface ProvinceSelectModalProps {
  visible: boolean;
  selectedProvince?: string;
  onSelect: (province: string) => void;
  onClose: () => void;
}

/**
 * Modal accesible de selección de provincia para el formulario de comprador.
 */
export function ProvinceSelectModal({
  visible,
  selectedProvince,
  onSelect,
  onClose,
}: ProvinceSelectModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Seleccioná tu provincia</Text>
          <FlatList
            data={ARGENTINE_PROVINCES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedProvince === item;
              return (
                <TouchableOpacity
                  style={[
                    styles.provinceItem,
                    isSelected && styles.provinceItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Provincia ${item}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.provinceText,
                      isSelected && styles.provinceTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <CheckIcon size={14} color={Palette.stepCurrent} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              );
            }}
            style={styles.provincesList}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar selección de provincia"
          >
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    width: '100%',
    maxHeight: '75%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  provincesList: {
    marginVertical: 6,
  },
  provinceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  provinceItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  provinceText: {
    fontSize: 13.5,
    color: Palette.charcoal,
  },
  provinceTextSelected: {
    fontWeight: '800',
    color: Palette.stepCurrent,
  },
  modalCloseButton: {
    backgroundColor: Palette.charcoal,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseButtonText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 13,
  },
});

