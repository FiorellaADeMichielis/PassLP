import React, { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckIcon } from '../ui/Icons';
import { BuyerData } from '@/types';
import {
  ARGENTINE_PROVINCES,
  cleanName,
  formatDNI,
  formatPhone,
  isValidEmail,
} from '@/utils/validation';

export {
  ARGENTINE_PROVINCES,
  cleanName,
  formatDNI,
  formatPhone,
  isValidEmail,
};

interface BuyerFormStepProps {
  initialData: BuyerData;
  onSubmit: (data: BuyerData) => void;
  onBack: () => void;
  onFocusField?: (offset: number) => void;
}

/**
 * Paso 2 del Checkout: Ingresá tus datos (S3.2).
 *
 * Formulario para datos del comprador con selector de provincias,
 * formateo en vivo de DNI y teléfono, validaciones estrictas y conmutador para titulares.
 */
export function BuyerFormStep({
  initialData,
  onSubmit,
  onBack,
  onFocusField,
}: BuyerFormStepProps) {
  const [formData, setFormData] = useState<BuyerData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showProvinceModal, setShowProvinceModal] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const dniRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const confirmEmailRef = useRef<TextInput>(null);

  function handleChange(field: keyof BuyerData, rawValue: string | boolean) {
    let processedValue = rawValue;

    if (typeof rawValue === 'string') {
      if (field === 'firstName' || field === 'lastName') {
        processedValue = cleanName(rawValue);
      } else if (field === 'dni') {
        processedValue = formatDNI(rawValue);
      } else if (field === 'phone') {
        processedValue = formatPhone(rawValue);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    const cleanFirstName = formData.firstName.trim();
    if (!cleanFirstName) {
      newErrors.firstName = 'Ingresá tu nombre';
    } else if (cleanFirstName.length < 2) {
      newErrors.firstName = 'Mínimo 2 letras (sin números ni símbolos)';
    }

    const cleanLastName = formData.lastName.trim();
    if (!cleanLastName) {
      newErrors.lastName = 'Ingresá tu apellido';
    } else if (cleanLastName.length < 2) {
      newErrors.lastName = 'Mínimo 2 letras (sin números ni símbolos)';
    }

    const dniDigits = formData.dni.replace(/\D/g, '');
    if (!dniDigits) {
      newErrors.dni = 'Ingresá tu DNI';
    } else if (dniDigits.length !== 8) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!phoneDigits) {
      newErrors.phone = 'Ingresá tu teléfono';
    } else if (phoneDigits.length < 8 || phoneDigits.length > 13) {
      newErrors.phone = 'Ingresá un teléfono válido (entre 8 y 13 dígitos)';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'Seleccioná una provincia';
    }

    const cleanMail = formData.email.trim();
    if (!cleanMail) {
      newErrors.email = 'Ingresá tu email';
    } else if (!isValidEmail(cleanMail)) {
      newErrors.email = 'Formato de email no válido (ej. usuario@dominio.com)';
    }

    const cleanConfirm = formData.confirmEmail.trim();
    if (!cleanConfirm) {
      newErrors.confirmEmail = 'Confirmá tu email';
    } else if (cleanMail.toLowerCase() !== cleanConfirm.toLowerCase()) {
      newErrors.confirmEmail = 'Los emails no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) {
      onSubmit(formData);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>INGRESÁ TUS DATOS</Text>
        <Text style={styles.subtitle}>
          Todos los campos marcados con asterisco (*) son obligatorios.
        </Text>

        {/* Fila 1: Nombre y Apellido */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>
              Nombre <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="Juan"
              placeholderTextColor="#999999"
              value={formData.firstName}
              onChangeText={(val) => handleChange('firstName', val)}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name-given"
              accessibilityLabel="Nombre del comprador"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => onFocusField?.(30)}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.label}>
              Apellido <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              ref={lastNameRef}
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Pérez"
              placeholderTextColor="#999999"
              value={formData.lastName}
              onChangeText={(val) => handleChange('lastName', val)}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="family-name"
              accessibilityLabel="Apellido del comprador"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => onFocusField?.(30)}
              onSubmitEditing={() => dniRef.current?.focus()}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>
        </View>

        {/* Fila 2: DNI y Teléfono */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>
              DNI <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              ref={dniRef}
              style={[styles.input, errors.dni && styles.inputError]}
              placeholder="12.345.678"
              placeholderTextColor="#999999"
              value={formData.dni}
              onChangeText={(val) => handleChange('dni', val)}
              keyboardType="numeric"
              maxLength={10}
              accessibilityLabel="DNI del comprador"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => onFocusField?.(110)}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            {errors.dni && <Text style={styles.errorText}>{errors.dni}</Text>}
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.label}>
              Teléfono <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              ref={phoneRef}
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="11 2345-6789"
              placeholderTextColor="#999999"
              value={formData.phone}
              onChangeText={(val) => handleChange('phone', val)}
              keyboardType="phone-pad"
              maxLength={16}
              autoComplete="tel"
              accessibilityLabel="Teléfono de contacto"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => onFocusField?.(110)}
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
        </View>

        {/* Fila 3: Provincia y Email */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>
              Provincia <Text style={styles.req}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectorButton, errors.province && styles.inputError]}
              onPress={() => setShowProvinceModal(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.selectorText,
                  !formData.province && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {formData.province || 'Seleccioná...'}
              </Text>
            </TouchableOpacity>
            {errors.province && (
              <Text style={styles.errorText}>{errors.province}</Text>
            )}
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.label}>
              Email <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              ref={emailRef}
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="juan@ejemplo.com"
              placeholderTextColor="#999999"
              value={formData.email}
              onChangeText={(val) => handleChange('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              accessibilityLabel="Correo electrónico del comprador"
              returnKeyType="next"
              blurOnSubmit={false}
              onFocus={() => onFocusField?.(190)}
              onSubmitEditing={() => confirmEmailRef.current?.focus()}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
        </View>

        {/* Fila 4: Confirmar Email (Ancho completo) */}
        <View style={styles.fullCol}>
          <Text style={styles.label}>
            Confirmar Email <Text style={styles.req}>*</Text>
          </Text>
          <TextInput
            ref={confirmEmailRef}
            style={[styles.input, errors.confirmEmail && styles.inputError]}
            placeholder="juan@ejemplo.com"
            placeholderTextColor="#999999"
            value={formData.confirmEmail}
            onChangeText={(val) => handleChange('confirmEmail', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            accessibilityLabel="Confirmación de correo electrónico"
            returnKeyType="done"
            onFocus={() => onFocusField?.(270)}
            onSubmitEditing={handleNext}
          />
          {errors.confirmEmail && (
            <Text style={styles.errorText}>{errors.confirmEmail}</Text>
          )}
        </View>

        {/* Conmutador: "¿Todas las entradas están al mismo nombre?" */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleQuestion}>
            ¿Todas las entradas están al mismo nombre?
          </Text>
          <View style={styles.toggleButtonsRow}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                formData.allTicketsSameName
                  ? styles.toggleOptionActive
                  : styles.toggleOptionInactive,
              ]}
              onPress={() => handleChange('allTicketsSameName', true)}
              activeOpacity={0.8}
            >
              {formData.allTicketsSameName && (
                <CheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
              )}
              <Text
                style={[
                  styles.toggleOptionText,
                  formData.allTicketsSameName
                    ? styles.toggleOptionTextActive
                    : styles.toggleOptionTextInactive,
                ]}
              >
                Sí
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleOption,
                !formData.allTicketsSameName
                  ? styles.toggleOptionActive
                  : styles.toggleOptionInactive,
              ]}
              onPress={() => handleChange('allTicketsSameName', false)}
              activeOpacity={0.8}
            >
              {!formData.allTicketsSameName && (
                <CheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
              )}
              <Text
                style={[
                  styles.toggleOptionText,
                  !formData.allTicketsSameName
                    ? styles.toggleOptionTextActive
                    : styles.toggleOptionTextInactive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.toggleExplanation}>
            {formData.allTicketsSameName
              ? 'Se asignará el mismo titular a todas las entradas.'
              : 'Podrás ingresar los datos de cada asistente en el próximo paso.'}
          </Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Siguiente paso"
        >
          <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver al resumen"
        >
          <Text style={styles.backButtonText}>ATRÁS</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para selección de provincia */}
      <Modal
        visible={showProvinceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProvinceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccioná tu provincia</Text>
            <FlatList
              data={ARGENTINE_PROVINCES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.provinceItem,
                    formData.province === item && styles.provinceItemSelected,
                  ]}
                  onPress={() => {
                    handleChange('province', item);
                    setShowProvinceModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.provinceText,
                      formData.province === item && styles.provinceTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {formData.province === item && (
                    <CheckIcon size={14} color="#1B9F00" strokeWidth={3} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.provincesList}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowProvinceModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  halfCol: {
    flex: 1,
  },
  fullCol: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  req: {
    color: '#E63946',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#E63946',
    backgroundColor: '#FFF5F5',
  },
  selectorButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 12.5,
    color: '#111827',
  },
  placeholderText: {
    color: '#999999',
  },
  errorText: {
    fontSize: 10,
    color: '#E63946',
    marginTop: 2,
    fontWeight: '600',
  },
  toggleSection: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  toggleQuestion: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
  },
  toggleButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 999,
    gap: 6,
  },
  toggleOptionActive: {
    backgroundColor: '#1B9F00',
    borderWidth: 1.5,
    borderColor: '#1B9F00',
  },
  toggleOptionInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BCBCBC',
  },
  toggleOptionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  toggleOptionTextActive: {
    color: '#FFFFFF',
  },
  toggleOptionTextInactive: {
    color: '#332F2B',
  },
  toggleExplanation: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#54C1C3',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#54C1C3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#332F2B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#BCBCBC',
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#332F2B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    color: '#332F2B',
  },
  provinceTextSelected: {
    fontWeight: '800',
    color: '#1B9F00',
  },
  modalCloseButton: {
    backgroundColor: '#332F2B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

