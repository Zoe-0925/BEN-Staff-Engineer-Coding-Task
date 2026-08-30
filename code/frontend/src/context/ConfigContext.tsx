import { createContext, type ReactNode } from 'react';

import commissionQuoteFormConfig from '../config/commissionQuoteFormConfig.json';
import type { ConfigContextValue } from '../schemas/ConfigContextValue';
import type { FormConfig } from '../schemas/FormConfig';

type ConfigProviderProps = {
  children: ReactNode;
};

export const ConfigContext = createContext<ConfigContextValue>(undefined);

// The reviewed static JSON is the configuration boundary and is provided without cloning it.
const formConfigs = commissionQuoteFormConfig as FormConfig[];

export function ConfigProvider({ children }: ConfigProviderProps) {
  return <ConfigContext.Provider value={formConfigs}>{children}</ConfigContext.Provider>;
}
