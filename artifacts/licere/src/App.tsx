import React from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { Shell } from '@/components/layout/Shell';
import HomePageScreen from '@/screens/home';
import LoginPage from '@/screens/login';

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Shell />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <WouterRouter>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={HomePageScreen} />
          <Route component={Router} />
        </Switch>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}
