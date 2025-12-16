interface WelcomeSectionProps {
  userEmail?: string;
  currentUserIP?: string | null;
}

export default function WelcomeSection({
  userEmail,
  currentUserIP,
}: WelcomeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Logged in as</p>
          <p className="text-lg font-semibold text-gray-900">{userEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Your IP Address</p>
          {currentUserIP && (
            <p className="text-lg font-mono font-semibold text-indigo-600">
              {currentUserIP}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

