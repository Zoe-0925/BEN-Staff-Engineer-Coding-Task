import { useContext } from 'react';

import { ConfigContext } from '../context/ConfigContext';
import type { FormConfig } from '../schemas/FormConfig';

export function useConfig(formContext: string): FormConfig | undefined {
  const formConfigs = useContext(ConfigContext);

  if (formConfigs === undefined) {
    throw new Error('useConfig must be used within ConfigProvider');
  }

  return formConfigs.find((formConfig) => formConfig.formContext === formContext);
}
