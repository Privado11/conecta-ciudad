import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import HeaderProfile from "@/shared/components/molecules/profile/HeaderProfile";
import InfoProfile from "@/shared/components/molecules/profile/InfoProfile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicFormModal } from "@/shared/components/molecules/DynamicFormModal";
import { userFormConfig } from "@/config/forms/userForm.config";

function ProfilePage() {
  const { userProfile, loading, validateUniqueFields, updateUser } = useUser();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!userProfile) return;
    await updateUser(userProfile.id, data);
    setIsOpenModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading.fetching && !userProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se pudo cargar el perfil</p>
          <Button onClick={handleGoBack} variant="outline">
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto py-0 px-0 sm:px-6 lg:px-8 max-w-7xl">
        <div className="p-1 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center cursor-pointer hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Volver</span>
            </Button>
          </div>
        </div>

        <Card className="w-full mx-auto">
          <HeaderProfile
            user={userProfile}
            onEdit={() => setIsOpenModal(true)}
          />

          <CardContent>
            <InfoProfile user={userProfile} />
          </CardContent>
        </Card>
      </div>

      <DynamicFormModal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        config={userFormConfig}
        initialData={userProfile}
        onValidate={validateUniqueFields}
        onSubmit={handleSubmit}
        loading={loading.updating}
        isAdmin={false}
      />
    </>
  );
}

export default ProfilePage;
