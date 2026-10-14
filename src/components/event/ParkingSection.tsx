import { useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkingBadgeIcon, TrashIcon } from '@/components/ui/Icons';
import { Palette, Spacing } from '@/constants/theme';
import { PatenteInput, normalizarPatente, validarPatente } from '@/features/parking';
import { ParkingOption, ParkingVehicle, VehicleType } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ParkingSectionProps {
  /** Opciones de tarifas de estacionamiento del evento. */
  options: ParkingOption[];
  /** Vehículos ya agregados por el usuario. */
  addedVehicles: ParkingVehicle[];
  /** Callback para agregar un nuevo vehículo. */
  onAddVehicle: (vehicle: ParkingVehicle) => void;
  /** Callback para remover un vehículo agregado. */
  onRemoveVehicle: (id: string) => void;
  /** Callback para auto-scrollear cuando el usuario hace foco en Patente. */
  onFocusPlate?: () => void;
  /** Callback para auto-scrollear cuando el usuario hace foco en Modelo. */
  onFocusModel?: () => void;
}

const VEHICLE_TYPES: VehicleType[] = ['Sedán', 'Pickup'];

/**
 * Sección interactiva de estacionamiento según especificación PASSLP §4.
 *
 * Permite desplegar opciones de parking, ingresar patente y modelo de vehículo,
 * y gestionar la lista dinámica de vehículos agregados a la orden.
 */
export function ParkingSection({
  options,
  addedVehicles,
  onAddVehicle,
  onRemoveVehicle,
  onFocusPlate,
  onFocusModel,
}: ParkingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType>('Sedán');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const modelInputRef = useRef<TextInput>(null);

  // Encuentra la tarifa para el tipo seleccionado o valor por defecto
  const currentOption = options.find((opt) => opt.vehicleType === selectedType);
  const currentPrice = currentOption ? currentOption.price : 10000;

  const isPlateValid = validarPatente(plate);
  const isModelValid = model.trim().length >= 2;
  const isAddEnabled = isPlateValid && isModelValid;

  function handleAdd() {
    if (!isPlateValid) return;
    const cleanModel = model.trim();
    if (!cleanModel || cleanModel.length < 2) {
      Alert.alert('Datos requeridos', 'Por favor ingresá el modelo del vehículo (mín. 2 caracteres).');
      return;
    }

    const cleanPlate = normalizarPatente(plate);

    const newVehicle: ParkingVehicle = {
      id: `pkg-${cleanPlate}-${addedVehicles.length + 1}`,
      vehicleType: selectedType,
      plate: cleanPlate,
      model: cleanModel,
      price: currentPrice,
    };

    onAddVehicle(newVehicle);
    setPlate('');
    setModel('');
  }

  return (
    <View style={styles.container}>
      {/* Botón de apertura / despliegue */}
      <TouchableOpacity
        style={[styles.toggleBtn, isExpanded && styles.toggleBtnActive]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Desplegar opciones de estacionamiento"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.toggleLeft}>
          <ParkingBadgeIcon size={20} color="#0D4F9C" />
          <Text style={styles.toggleTitle} maxFontSizeMultiplier={1.3}>
            Comprar estacionamiento
          </Text>
        </View>
        <Text style={styles.toggleChevron} maxFontSizeMultiplier={1.3}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Contenido desplegable */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Tarifas de referencia */}
          <View style={styles.ratesBox}>
            <Text style={styles.ratesTitle} maxFontSizeMultiplier={1.3}>
              Tarifas disponibles:
            </Text>
            <View style={styles.ratesRow}>
              {options.map((opt) => (
                <View key={opt.id} style={styles.ratePill}>
                  <Text style={styles.rateType} maxFontSizeMultiplier={1.3}>
                    {opt.vehicleType}:
                  </Text>
                  <Text style={styles.ratePrice} maxFontSizeMultiplier={1.3}>
                    {formatCurrency(opt.price)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Formulario para agregar vehículo */}
          <View style={styles.formBox}>
            <Text style={styles.formSectionTitle}>DATOS DEL VEHÍCULO</Text>

            {/* Selector de Tipo de Vehículo */}
            <Text style={styles.inputLabel}>TIPO DE VEHÍCULO</Text>
            <View style={styles.typeSelectorRow}>
              {VEHICLE_TYPES.map((type) => {
                const isSelected = type === selectedType;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, isSelected && styles.typeChipSelected]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && styles.typeChipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input Patente */}
            <Text style={styles.inputLabel}>PATENTE</Text>
            <PatenteInput
              style={styles.input}
              value={plate}
              onChange={setPlate}
              placeholder="Ej. AB123CD o ABC123"
              onFocus={onFocusPlate}
              onSubmitEditing={() => modelInputRef.current?.focus()}
            />

            {/* Input Modelo */}
            <Text style={styles.inputLabel}>MODELO</Text>
            <TextInput
              ref={modelInputRef}
              style={styles.input}
              placeholder="Ej. Toyota Hilux, Peugeot 208"
              placeholderTextColor="#999999"
              value={model}
              onChangeText={setModel}
              autoCorrect={false}
              returnKeyType="done"
              onFocus={onFocusModel}
              onSubmitEditing={handleAdd}
            />

            {/* Resumen del precio del vehículo y botón agregar */}
            <View style={styles.actionRow}>
              <View>
                <Text style={styles.priceLabel}>Precio del pase:</Text>
                <Text style={styles.priceValue}>{formatCurrency(currentPrice)}</Text>
              </View>

              <TouchableOpacity
                style={[styles.addBtn, !isAddEnabled && styles.addBtnDisabled]}
                onPress={handleAdd}
                disabled={!isAddEnabled}
                accessibilityRole="button"
                accessibilityLabel="Agregar vehículo de estacionamiento"
                accessibilityState={{ disabled: !isAddEnabled }}
              >
                <Text style={styles.addBtnText}>AGREGAR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de vehículos agregados */}
          {addedVehicles.length > 0 && (
            <View style={styles.addedList}>
              <Text style={styles.addedTitle}>
                Vehículos agregados ({addedVehicles.length}):
              </Text>

              {addedVehicles.map((item) => (
                <View key={item.id} style={styles.vehicleItem}>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehiclePlate}>
                      {item.plate} · {item.vehicleType}
                    </Text>
                    <Text style={styles.vehicleModel}>{item.model}</Text>
                  </View>

                  <View style={styles.vehicleRight}>
                    <Text style={styles.vehiclePrice}>{formatCurrency(item.price)}</Text>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => onRemoveVehicle(item.id)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel="Eliminar vehículo"
                    >
                      <TrashIcon size={16} color="#000000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.two,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#CCCCCC', // Borde grisáceo sutil de contorno
    backgroundColor: '#FFFFFF',
  },
  toggleBtnActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: '#BBBBBB',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    flexShrink: 1,
  },
  toggleChevron: {
    fontSize: 12,
    color: '#777777',
    paddingLeft: 6,
    flexShrink: 0,
  },
  expandedContent: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.2,
    borderTopWidth: 0,
    borderColor: '#BBBBBB',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  ratesBox: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.two,
    borderRadius: 8,
    gap: 6,
  },
  ratesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555555',
    textTransform: 'uppercase',
  },
  ratesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ratePill: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#EEF4FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rateType: {
    fontSize: 11,
    color: '#0D4F9C',
    fontWeight: '600',
  },
  ratePrice: {
    fontSize: 11,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  formBox: {
    backgroundColor: Palette.white,
    padding: Spacing.three,
    borderRadius: 10,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  formSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777777',
    marginTop: 2,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.white,
  },
  typeChipSelected: {
    borderColor: '#0D4F9C',
    backgroundColor: '#0D4F9C',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444444',
  },
  typeChipTextSelected: {
    color: Palette.white,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 11,
    color: '#777777',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  addBtn: {
    backgroundColor: Palette.black,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  addedList: {
    gap: 6,
    marginTop: 4,
  },
  addedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  vehicleInfo: {
    gap: 2,
  },
  vehiclePlate: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  vehicleModel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  vehicleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehiclePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.black,
  },
  removeBtn: {
    padding: 4,
  },
});
