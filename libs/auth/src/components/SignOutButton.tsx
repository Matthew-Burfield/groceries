import { useAuth } from '@clerk/clerk-expo';
import { View, Button } from 'react-native';

const SignOutButton = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut(() => {
            console.log('Logged out!');
          }, {});
        }}
      />
    </View>
  );
};

export default SignOutButton;
