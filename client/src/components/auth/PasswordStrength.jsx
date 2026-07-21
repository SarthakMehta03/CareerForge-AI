function PasswordStrength({ password }) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const levels = [
    {
      label: "Very Weak",
      color: "bg-red-500",
      width: "w-1/4",
    },
    {
      label: "Weak",
      color: "bg-orange-500",
      width: "w-2/4",
    },
    {
      label: "Good",
      color: "bg-yellow-500",
      width: "w-3/4",
    },
    {
      label: "Strong",
      color: "bg-green-500",
      width: "w-full",
    },
  ];

  if (!password) return null;

  const current = levels[Math.max(0, strength - 1)];

  return (
    <div className="mt-2 mb-4">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${current.color} ${current.width} transition-all duration-300`}
        ></div>
      </div>

      <p className="text-sm mt-2 text-gray-600">
        Password Strength:{" "}
        <span className="font-semibold">
          {current.label}
        </span>
      </p>
    </div>
  );
}

export default PasswordStrength;