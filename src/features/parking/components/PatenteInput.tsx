import React, { useEffect, useState } from 'react';
import {
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { normalizarPatente, validarPatente } from '../domain/patente';

export interface PatenteInputProps {
  /** Valor controlado actual de la patente. */
  value: string;
  /** Callback ejecutado al cambiar el texto; entrega el valor normalizado. */
  onChange: (valorNormalizado: string) => void;
  /** Mensaje de error provisto externamente (prioridad alta). */
  error?: string;
  /** Placeholder opcional del input. */
  placeholder?: string;
  /** Callback al ganar foco. */
  onFocus?: () => void;
  /** Callback al presionar submit/enter. */
  onSubmitEditing?: () => void;
  /** Tipo de tecla de retorno. */
  returnKeyType?: ReturnKeyTypeOptions;
  /** Si debe perder foco al enviar. */
  blurOnSubmit?: boolean;
  /** Estilos opcionales para personalizar el TextInput (ej. igualar al input de modelo). */
  style?: StyleProp<TextStyle>;
}

/**
 * Componente controlado de entrada de patente vehicular (Argentina / Mercosur).
 *
 * Normaliza automáticamente la entrada a mayúsculas descartando caracteres inválidos.
 * Muestra mensaje de error accesible ante entradas no válidas tras perder el foco.
 */
export const PatenteInput = React.forwardRef<TextInput, PatenteInputProps>(
  function PatenteInput(
    {
      value,
      onChange,
      error: externalError,
      placeholder = 'Ej. AB123CD o ABC123',
      onFocus,
      onSubmitEditing,
      returnKeyType = 'next',
      blurOnSubmit = false,
      style,
    },
    ref,
  ) {
    const { colors } = useAppTheme();
    const [, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    // Si el valor se limpia (ej. al agregar vehículo con éxito), reiniciamos el estado touched
    useEffect(() => {
      if (value === '') {
        setTouched(false);
      }
    }, [value]);

    // Error interno tras perder foco con valor inválido (solo si hay contenido inválido)
    const internalError =
      touched && value.length > 0 && !validarPatente(value)
        ? 'Ingresá la patente (3-12 caracteres)'
        : undefined;

    const activeError = externalError || internalError;

    function handleChangeText(rawText: string) {
      const normalized = normalizarPatente(rawText);
      onChange(normalized);
    }

    function handleFocus() {
      onFocus?.();
    }

    function handleBlur() {
      setTouched(true);
    }

    // El borde no se torna naranja al estar activo, se mantiene neutro igual que el input de modelo.
    const borderColor = activeError
      ? colors.inputBorderError
      : colors.inputBorder;

    return (
      <View style={styles.container}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor,
              color: colors.inputText,
            },
            style,
            activeError && { borderColor: colors.inputBorderError },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          maxLength={12}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel="Patente del vehículo"
        />

        {activeError ? (
          <View
            style={styles.errorContainer}
            accessibilityLiveRegion="polite"
          >
            <Text style={[styles.errorText, { color: colors.inputBorderError }]}>
              {activeError}
            </Text>
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.two,
    fontSize: 13,
  },
  errorContainer: {
    marginTop: Spacing.one,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

