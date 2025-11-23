import { AdminDashboard } from '@/shared/components/organisms/dashboard/AdminDashboard';
import { CuratorDashboard } from '@/shared/components/organisms/dashboard/CuratorDashboard';
import { useAuth } from '@/hooks/useAuth';

function Home() {
  const { user } = useAuth();

  const isAdmin = user?.roles?.includes('ADMIN');
  const isCurator = user?.roles?.includes('CURATOR');


  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isCurator) {
    return <CuratorDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bienvenido a Conecta Ciudad</h1>
        <p className="text-muted-foreground mt-2">
          Dashboard en construcción para tu rol
        </p>
      </div>
    </div>
  );
}

export default Home;