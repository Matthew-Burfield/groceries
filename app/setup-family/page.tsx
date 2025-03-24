import { redirect } from 'next/navigation';
import FamilySetupForm from '@/components/families/FamilySetupForm';
import { getServerCurrentUser } from '@/lib/auth';

export default async function SetupFamilyPage() {
  const user = await getServerCurrentUser();
  
  // Redirect if user is not logged in
  if (!user) {
    redirect('/login');
  }
  
  // Check if user is already in a family
  if (user.familyMembers && user.familyMembers.length > 0) {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <FamilySetupForm />
    </div>
  );
} 