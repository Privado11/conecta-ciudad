import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import HeaderProfile from "@/shared/components/molecules/profile/HeaderProfile";
import InfoProfile from "@/shared/components/molecules/profile/InfoProfile";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DynamicFormModal } from "@/shared/components/molecules/DynamicFormModal";
import { userFormConfig } from "@/config/forms/userForm.config";

function ProfilePage() {
  const {
    selectedUser,
    getUserById,
    getCurrentUser,
    loading,
    validateUniqueFields,
    updateUser,
  } = useUser();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.id) {
      getUserById(currentUser.id);
    }
  }, []);

  const handleSubmit = async (data: any) => {
    await updateUser(currentUser.id, data);
    setIsOpenModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!selectedUser) {
    return <div className="p-6">Loading profile...</div>;
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
            user={selectedUser}
            onEdit={() => setIsOpenModal(true)}
          />

          <CardContent>
            <InfoProfile user={selectedUser} />
          </CardContent>
        </Card>
      </div>

      <DynamicFormModal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        config={userFormConfig}
        initialData={selectedUser}
        onValidate={validateUniqueFields}
        onSubmit={handleSubmit}
        loading={loading.updating}
        isAdmin={false}
      />
    </>
  );
}

export default ProfilePage;
