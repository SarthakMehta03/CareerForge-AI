import { CheckCircle, XCircle } from "lucide-react";

function EmailValidation({ email }) {
  if (email.length < 3) return null;
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const isValid = emailRegex.test(email);

  return (
    <div className="flex items-center gap-2 mt-2 mb-4">
      {isValid ? (
        <>
          <CheckCircle
            size={18}
            className="text-green-500"
          />

          <span className="text-sm text-green-600 font-medium">
            Valid Email
          </span>
        </>
      ) : (
        <>
          <XCircle
            size={18}
            className="text-red-500"
          />

          <span className="text-sm text-red-600 font-medium">
            Invalid Email
          </span>
        </>
      )}
    </div>
  );
}

export default EmailValidation;