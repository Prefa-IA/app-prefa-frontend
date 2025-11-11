import React from 'react';

export interface ConfirmModalProps {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ErrorMessageProps {
  message: string | null;
}

export interface LoaderProps {
  message?: string;
}

export interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export interface ModalBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hideConfirm?: boolean;
  confirmText?: string;
}

export interface PageNumberProps {
  pageNumber: number;
  className?: string;
}

export interface DataTableExtraProps {
  useParentHeader?: boolean;
  bodyClassName?: string;
}

export interface GridTableHeaderProps {
  columns: string[];
  gridClass: string;
}

export interface GridTableRowProps {
  values: (string | number | React.ReactNode)[];
  gridClass: string;
}

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export interface FontSelectorProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export interface GoogleLoginButtonProps {
  className?: string;
  onSuccessNavigate?: string;
  variant?: 'googleDefault' | 'customRed';
}

export interface PrefaInfoModalProps {
  onClose: () => void;
}

export interface PrivacyPolicyProps {
  onClose: () => void;
}

export interface TermsAndConditionsProps {
  onClose: () => void;
}

export interface UsigMapContainerProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
  className?: string;
}

export interface LoginFormComponentProps {
  credentials: {
    email: string;
    password: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LoginFieldsProps {
  credentials: {
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ExtendedLoginFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TermsModalProps {
  onClose: () => void;
}

export interface ProfileCardProps {
  logoUrl: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoDelete?: () => void;
}

export interface BillingFormProps {
  onSuccess?: () => void;
}

export interface PlanCardProps {
  plan: any;
  loading?: boolean;
  onSelect?: () => void;
}

export interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export interface SupportTicketModalProps {
  onClose: () => void;
}

export interface FooterModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export interface MobileMenuProps {
  navigation: any[];
  usuario: any;
  planObj: any | null;
  onLogout: () => void;
}

export interface NavigationLinkProps {
  item: any;
}

export interface UserMenuButtonProps {
  usuario: any;
  planObj: any | null;
}

export interface UserNameAndPlanProps {
  nombre: string;
  plan?: string;
  planObj: any | null;
}

export interface UserMenuItemsProps {
  onLogout: () => void;
}

export interface MobileMenuButtonProps {
  open: boolean;
}

export interface MobileNavigationProps {
  navigation: any[];
}

export interface MobileNavigationLinkProps {
  item: any;
}

export interface PlanPillSectionProps {
  planObj: any | null;
  className?: string;
}

export interface BillingModalProps {
  existing: any;
  onClose: () => void;
}

export interface BillingSectionProps {
}

export interface AddressListHeaderProps {
  addressCount: number;
}

export interface AddressGridProps {
  addresses: string[];
  onRemove: (index: number) => void;
  isLoading: boolean;
}

export interface AddressItemProps {
  address: string;
  index: number;
  onRemove: (index: number) => void;
  isLoading: boolean;
}

export interface AddressTextProps {
  address: string;
}

export interface RemoveButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export interface SearchButtonProps {
  onSearch: () => void;
  isLoading: boolean;
  addressCount: number;
  minCount: number;
}

export interface MapContainerProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
}

export interface MetricCardProps {
  label: string;
  value: string;
  borderColor: string;
}

export interface TronerasMetricCardProps {
  totalTroneras: number;
}

export interface TronerasTableBodyProps {
  troneras: any[];
}

export interface TroneraRowProps {
  tronera: any;
  index: number;
}

export interface TipoEsquinaBadgeProps {
  tipo?: string;
}

export interface DistanciasCellProps {
  tronera: any;
}

export interface TronerasTableFooterProps {
  troneras: any[];
}

export interface FacadeImageGridProps {
  images: string[];
}

export interface FacadeImageItemProps {
  imageUrl: string;
  index: number;
}

export interface MetricsContentProps {
  mediciones: any;
  geoJSONData: any;
}

export interface TronerasSectionProps {
  troneras: any[];
}

export interface TronerasHeaderProps {
  tronerasCount: number;
}

export interface DirectionsSectionProps {
  direcciones: string[];
}

export interface UvaInputModalProps {
  defaultValue: number;
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

export interface ConsultaMapContainerProps {
  center: { lat: number; lng: number };
  showMarker?: boolean;
}

export interface PersonalizationSectionProps {
  editMode: boolean;
  personalizacion: any;
  onPersonalizacionChange: (field: string, value: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

export interface ReportPreviewModalProps {
  onClose: () => void;
  personalizacion: any;
  nombreInmobiliaria: string;
}

export interface ChangePlanModalProps {
  onClose: () => void;
  currentPlanId: string | null;
  onChanged?: () => void;
}

export interface OverageFormProps {
  data: any;
  onSave: (d: any) => void;
  onClose: () => void;
}

export interface ErrorDisplayProps {
  error: string;
}

export interface LoadingOverlayProps {
  loading: boolean;
  loadingData: boolean;
  smp: string;
}

export interface LoadingDataContentProps {
  smp: string;
}

export interface PlanoSectionProps {
  informe: any;
}

export interface ParcelInfoItemProps {
  label: string;
  value: string;
}

export interface CroquisSectionProps {
  croquis?: string;
  pageCounter: number;
}

export interface PerimetroSectionProps {
  perimetro?: string;
  informe: any;
  pageCounter: number;
  lbiLfiPageCounter?: number;
}

export interface PlanoIndiceSectionProps {
  planoIndice?: string;
  pageCounter: number;
}

export interface CompoundCroquisSectionProps {
  croquis: string[];
  pageCounter: number;
}

export interface CompoundPerimetrosSectionProps {
  perimetros: string[];
  pageCounter: number;
}

export interface CompoundPlanosIndiceSectionProps {
  planosIndice: string[];
  pageCounter: number;
}

export interface ImageViewerProps {
  url: string;
  title: string;
  defaultImageUrl: string;
}

export interface LbiLfiSectionProps {
  informe: any;
  informesIndividuales?: any[];
  esCompuesto?: boolean;
  pageCounter?: number;
}

export interface CapacidadConstructivaTableProps {
  informe: any;
  calculatedValues: any;
  informeCompuesto?: any;
  esInformeCompuesto?: boolean;
}

export interface CalculoA1TableProps {
  informe: any;
  calculatedValues: any;
}

export interface CalculoA2TableProps {
  informe: any;
  calculatedValues: any;
}

export interface PlusvaliaFinalTableProps {
  calculatedValues: any;
}

export interface MapData {
  lfi: GeoJSON.FeatureCollection;
  lib: GeoJSON.FeatureCollection;
  parcela?: GeoJSON.FeatureCollection;
  afectaciones?: {
    parcela_afectada_lfi: GeoJSON.Feature | null;
    parcela_afectada_lib: GeoJSON.Feature | null;
    porcentaje_afectacion_lfi: number;
    porcentaje_afectacion_lib: number;
    area_total_parcela: number;
    area_afectada_lfi: number;
    area_afectada_lib: number;
  };
  estadisticas?: {
    total_esquinas: number;
    esquinas_con_troneras: number;
    porcentaje_afectacion_lfi: number;
    porcentaje_afectacion_lib: number;
  };
}

export interface ViewerProps {
  smp: string;
  centro: { lat: number; lon: number };
  geometriaParcela?: any;
  showStatsOverlay?: boolean;
}

export interface ConsultaContainerProps {
  children: React.ReactNode;
}

export interface ConsultaHeaderProps {
}

export interface ReportContainerProps {
  children: React.ReactNode;
}

export interface ProcessingOverlayProps {
  seconds: number;
}

