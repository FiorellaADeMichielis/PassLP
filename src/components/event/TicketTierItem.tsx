import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MinusIcon, PlusIcon } from '@/components/ui/Icons';
import { Spacing } from '@/constants/theme';
import { TicketTier } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface TicketTierItemProps {
  /** Lote o categoría de ticket. */
  tier: TicketTier;
  /** Cantidad actual seleccionada. */
  quantity: number;
  /** Callback para modificar la cantidad. */
  onChangeQuantity: (newQuantity: number) => void;
}

/**
 * Fila de lote/tanda de entradas con selector numérico.
 *
 * Muestra nombre del lote, tipo, descripción, precio y el control
 * de cantidad en píldora negra según la especificación de PASSLP §3.2.
 */
export function TicketTierItem({
  tier,
  quantity,
  onChangeQuantity,
}: TicketTierItemProps) {
  const isMin = quantity <= 0;
  const isMax = quantity >= Math.min(tier.availableQuantity, tier.maxPerPurchase);

  function handleDecrement() {
    if (!isMin) {
      onChangeQuantity(quantity - 1);
    }
  }

  function handleIncrement() {
    if (!isMax) {
      onChangeQuantity(quantity + 1);
    }
  }

  const formattedPrice = formatCurrency(tier.price);

  return (
    <View style={styles.container}>
      {/* Información del lote */}
      <View style={styles.infoCol}>
        <View style={styles.badgeRow}>
          <Text style={styles.tierLabel} maxFontSizeMultiplier={1.3}>
            {tier.tierLabel.toUpperCase()}
          </Text>
          <Text style={styles.tierType} maxFontSizeMultiplier={1.3}>
            · {tier.type}
          </Text>
        </View>

        <Text style={styles.name} maxFontSizeMultiplier={1.3}>
          {tier.name}
        </Text>

        {tier.description ? (
          <Text
            style={styles.description}
            selectable={true}
            maxFontSizeMultiplier={1.3}
          >
            {tier.description}
          </Text>
        ) : null}

        <Text style={styles.price} maxFontSizeMultiplier={1.3}>
          {formattedPrice}
        </Text>
      </View>

      {/* Selector de cantidad en píldora negra */}
      <View style={styles.stepperWrapper}>
        <View style={styles.stepperPill}>
          <TouchableOpacity
            style={[styles.stepperBtn, isMin && styles.stepperBtnDisabled]}
            onPress={handleDecrement}
            disabled={isMin}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Quitar una entrada de ${tier.name}`}
          >
            <MinusIcon size={12} color={isMin ? '#666666' : '#FFFFFF'} />
          </TouchableOpacity>

          <Text style={styles.quantityText} maxFontSizeMultiplier={1.3}>
            {quantity}
          </Text>

          <TouchableOpacity
            style={[styles.stepperBtn, isMax && styles.stepperBtnDisabled]}
            onPress={handleIncrement}
            disabled={isMax}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Agregar una entrada de ${tier.name}`}
          >
            <PlusIcon size={12} color={isMax ? '#666666' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>

        {tier.availableQuantity <= 5 && tier.availableQuantity > 0 ? (
          <Text style={styles.lastUnitsText} maxFontSizeMultiplier={1.3}>
            ¡Últimas {tier.availableQuantity} entradas!
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E85D04',
    letterSpacing: 0.5,
  },
  tierType: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '600',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  description: {
    fontSize: 11,
    color: '#666666',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  stepperWrapper: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 4,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 5,
    gap: 10,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: 'transparent',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    minWidth: 18,
    textAlign: 'center',
  },
  lastUnitsText: {
    fontSize: 9,
    color: '#E63946',
    fontWeight: '600',
  },
});

