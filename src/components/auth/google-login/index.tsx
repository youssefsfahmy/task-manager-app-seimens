import Google from "@/components/common/icons/google";
import { signInWithGoogle } from "@/utils/firebase";

const GoogleLoginButton = () => {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={signInWithGoogle}
    >
      <div className="relative border w-full bg-white text-gray-500 flex items-center py-2 px-2 gap-2 text-xs rounded text-center content-center justify-center">
        <div className="w-3 absolute left-3">
          <Google />
        </div>
        Login with Google
      </div>
    </div>
  );
};

export default GoogleLoginButton;
