"use client";
import { useUser } from "@/contexts/UserContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const { user, application } = useUser();
  const { dict } = useLanguage();

  if (!user) {
    return <p className="text-center mt-10">{dict.profile.loading}</p>;
  }

  // Determine background color based on application status
  const statusColors = {
    unhandled: "bg-yellow-50 border-l-4 border-yellow-400",
    accepted: "bg-green-50 border-l-4 border-green-400",
    rejected: "bg-red-50 border-l-4 border-red-400",
  };
  const applicationBg = application ? statusColors[application.status] || "bg-gray-50 border-l-4 border-gray-300" : "";

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* User Info Section */}
      <div className="flex flex-col items-center text-center">
        <UserCircleIcon className="w-24 h-24 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">
          {user.name} {user.surname}
        </h1>
        <p className="text-gray-500 mt-1">@{user.username}</p>
        <p className="text-gray-700 mt-2">{user.email}</p>
        <p className="text-gray-500 mt-1">{dict.profile.pnr}: {user.pnr}</p>
      </div>

      {/* User's Application */}
      {application && (
        <div className={`mt-8 p-6 border rounded-lg ${applicationBg}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{dict.profile.application}</h2>
          <p className="text-lg font-semibold text-gray-800 mb-1">{dict.profile.status}: <span className="capitalize">{application.status}</span></p>
          <p className="text-gray-600">{dict.profile.submitted_on}: {new Date(application.submission_date).toLocaleDateString()}</p>

          {/* Competences Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-1">{dict.profile.competences}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set(application.competences.map(comp => `${comp.name} (${comp.years_of_experience} ${dict.profile.years})`))].map((comp, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-1">{dict.profile.availability}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {application.availability.map((avail, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md">
                  {avail.from_date} → {avail.to_date}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
