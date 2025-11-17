import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { canAccess } from '../utils/acl';
import NotAuthorized from '../screens/NotAuthorized';

export function withGuard<T extends object = {}>(RouteName: any, Component: React.ComponentType<T>) {
  const Guarded = (props: T) => {
    const { user } = useAuth();
    const perfil = user?.perfil ?? null;
    return canAccess(RouteName, perfil) ? <Component {...props} /> : <NotAuthorized />;
  };
  return Guarded;
}
