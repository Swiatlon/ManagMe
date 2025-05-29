import type React from 'react';
import { useMatches as originalUseMatches } from 'react-router-dom';
import { Role } from '../contract/enums';

export interface IRouteHandle {
  navigation?: {
    text: string;
    icon: React.JSX.Element;
  };
  permissions?: {
    availableForRoles?: Role[];
  };
}

export interface ITypedUIMatch<Params = unknown, Data = unknown> {
  handle?: IRouteHandle;
  pathname: string;
  params: Params;
  data: Data;
}

export function useTypedMatches(): ITypedUIMatch[] {
  return originalUseMatches() as ITypedUIMatch[];
}
