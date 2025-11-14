import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User, ArrowLeft, AlertTriangle, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProfileSettings from "@/shared/components/molecules/setting/ProfileSettings";
import PasswordSettings from "@/shared/components/molecules/setting/PasswordSettings";
import AccountSettings from "@/shared/components/molecules/setting/AccountSettings";
import { useUser } from "@/hooks/useUser";
import AppearanceSettings from "@/shared/components/molecules/setting/AppearanceSettings";

function SettingsPage() {
  const { logout } = useAuth();
  const {
    selectedUser,
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    loading,
    validateUniqueFields,
  } = useUser();

  const [currentTab, setCurrentTab] = useState("profile");

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.id) {
      getUserById(currentUser.id);
    }
  }, []);

  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleUpdateProfile = async (data: any) => {
    if (!selectedUser) return;
    await updateUser(selectedUser.id, data);
  };

  const handleUpdatePassword = async (data: any) => {
    if (!selectedUser) return;
    await changePassword(selectedUser.id, data);
  };

  const handleDeleteAccount = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
  };

  const handleGoBack = () => navigate(-1);
  const handleLogout = () => logout();

  const tabsConfig = [
    {
      key: "profile",
      label: "Perfil",
      icon: User,
      content: selectedUser && (
        <ProfileSettings
          user={selectedUser}
          updateProfile={handleUpdateProfile}
        />
      ),
    },
    {
      key: "password",
      label: "Contraseña",
      icon: Lock,
      content: (
        <PasswordSettings
          updatePassword={handleUpdatePassword}
          loading={loading.updating}
        />
      ),
    },
    {
      key: "appearance",
      label: "Apariencia",
      icon: Palette,
      content: <AppearanceSettings />,
    },
    {
      key: "account",
      label: "Cuenta",
      icon: AlertTriangle,
      content: (
        <AccountSettings
          handleLogout={handleLogout}
          loading={loading.updating}
          handleDeleteAccount={handleDeleteAccount}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <div className="px-8 mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="cursor-pointer hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Volver</span>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600 mt-2">
              Administra tu cuenta, seguridad y preferencias
            </p>
          </div>

          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 bg-white">
              {tabsConfig.map(({ key, label, icon: Icon }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile">
              {selectedUser && (
                <ProfileSettings
                  user={selectedUser}
                  updateProfile={handleUpdateProfile}
                />
              )}
            </TabsContent>

            <TabsContent value="password">
              <PasswordSettings
                updatePassword={handleUpdatePassword}
                loading={loading.updating}
              />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings
                handleLogout={handleLogout}
                loading={loading.updating}
                handleDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="md:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        </div>

        <div className="px-4 py-6">
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleTabChange("profile")}
                className={`flex items-center justify-start w-full h-14 px-4 border rounded-lg transition-colors ${
                  currentTab === "profile"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span className="font-medium">Perfil</span>
              </button>

              <button
                onClick={() => handleTabChange("password")}
                className={`flex items-center justify-start w-full h-14 px-4 border rounded-lg transition-colors ${
                  currentTab === "password"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Lock className="h-5 w-5 mr-3" />
                <span className="font-medium">Contraseña</span>
              </button>

              <button
                onClick={() => handleTabChange("appearance")}
                className={`flex items-center justify-start w-full h-14 px-4 border rounded-lg transition-colors ${
                  currentTab === "appearance"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Palette className="h-5 w-5 mr-3" />
                <span className="font-medium">Apariencia</span>
              </button>

              <button
                onClick={() => handleTabChange("account")}
                className={`flex items-center justify-start w-full h-14 px-4 border rounded-lg transition-colors ${
                  currentTab === "account"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="h-5 w-5 mr-3" />
                <span className="font-medium">Cuenta</span>
              </button>
            </div>

            <div className="mt-6">
              <TabsContent value="profile" className="mt-0">
                {selectedUser && (
                  <ProfileSettings
                    user={selectedUser}
                    updateProfile={handleUpdateProfile}
                    onValidate={validateUniqueFields}
                    loading={loading.updating}
                  />
                )}
              </TabsContent>

              <TabsContent value="password" className="mt-0">
                <PasswordSettings
                  updatePassword={handleUpdatePassword}
                  loading={loading.updating}
                />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <AppearanceSettings />
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <AccountSettings
                  handleLogout={handleLogout}
                  loading={loading.updating}
                  handleDeleteAccount={handleDeleteAccount}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
