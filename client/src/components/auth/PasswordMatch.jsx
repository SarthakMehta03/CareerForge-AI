import { CheckCircle, XCircle } from "lucide-react";

function PasswordMatch({ password, confirmPassword }) {
    if (confirmPassword.length < 3) return null;
    if (!confirmPassword) return null;

  const isMatch = password === confirmPassword;

  return (
    <div className="flex items-center gap-2 mt-2 mb-4">
      {isMatch ? (
        <>
          <CheckCircle
            size={18}
            className="text-green-500"
          />

          <span className="text-sm text-green-600 font-medium">
            Passwords Match
          </span>
        </>
      ) : (
        <>
          <XCircle
            size={18}
            className="text-red-500"
          />

          <span className="text-sm text-red-600 font-medium">
            Passwords Do Not Match
          </span>
        </>
      )}
    </div>
  );
}

export default PasswordMatch;