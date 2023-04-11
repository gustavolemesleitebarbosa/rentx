import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { LogBox } from 'react-native';
import { LoadAnimation } from '../components/LoadAnimation';
import { useAuth } from '../hooks/auth';
import { AppTabRoutes } from './app.tab.routes';
import { AuthRoutes } from './auth.routes';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

export function Routes() {
  const { user, loading } = useAuth();
  return (
    loading ? <LoadAnimation /> :
      <NavigationContainer>
        {user.id ? <AppTabRoutes /> : <AuthRoutes />}
      </NavigationContainer>
  );
}