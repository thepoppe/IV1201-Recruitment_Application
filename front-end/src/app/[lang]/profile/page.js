"use client";
import { useUser } from "@/contexts/UserContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return <p className="text-center mt-10">Loading user data...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
      {/* User Icon */}
      <UserCircleIcon className="w-24 h-24 text-gray-400 mb-4" />

      {/* User Info */}
      <h1 className="text-2xl font-bold text-gray-900">
        {user.name} {user.surname}
      </h1>
      <p className="text-gray-600">@{user.username}</p>
      <p className="text-gray-700 mt-2">{user.email}</p>
      <p className="text-gray-500 mt-1">PNR: {user.pnr}</p>
    </div>
  );
}
