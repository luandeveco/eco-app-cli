import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  MakeRoute: undefined;
  Relatory: undefined;
  Settings: undefined;
  Printers: undefined;
  SettingsReceipt: undefined;
  SettingsAppearance: undefined;
  Receipt: { receipt_id: number; payment_id: number };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
export type { NavigationProp };
