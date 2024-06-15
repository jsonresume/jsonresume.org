import Dashboard from './components/Dashboard';

// @todo - come up with a strategy of what Pages should handle
// I think they should just handle url params and pass them to components

export default async function Page() {
  return <Dashboard />;
}
