"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminPage() {
  const { user, token } = useUser();
  const { dict, lang } = useLanguage();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) return; // Ensure user and token are available

    if (user.role !== "recruiter") {
      router.push("/"); // Redirect non-recruiters
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/application/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(response.data.data);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err);
        setError(dict.admin.error_fetching);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, token, router]);

  if (loading) return <p className="text-center mt-10">{dict.admin.loading}</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{dict.admin.title}</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">{dict.admin.id}</th>
            <th className="border px-4 py-2">{dict.admin.applicant}</th>
            <th className="border px-4 py-2">{dict.admin.email}</th>
            <th className="border px-4 py-2">{dict.admin.competences}</th>
            <th className="border px-4 py-2">{dict.admin.availability}</th>
            <th className="border px-4 py-2">{dict.admin.status}</th>
            <th className="border px-4 py-2">{dict.admin.actions}</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.application_id} className="hover:bg-gray-100">
                {/* Application id */}
                <td className="border px-4 py-2">{app.application_id}</td>

                {/* Applicant Name */}
                <td className="border px-4 py-2">
                  {app.applicant.name} {app.applicant.surname}
                </td>

                {/* Applicant Email */}
                <td className="border px-4 py-2">{app.applicant.email}</td>

                {/* Competences */}
                <td className="border px-4 py-2">
                  {[...new Set(
                    app.competences.map(
                      (comp) => `${comp.name} (${comp.years_of_experience})`
                    )
                  )].join(", ")}
                </td>

                {/* Availability */}
                <td className="border px-4 py-2">
                  {app.availability
                    .map((avail) => `${avail.from_date} → ${avail.to_date}`)
                    .join(", ")}
                </td>

                {/* Status */}
                <td className={`border px-4 py-2 capitalize ${app?.status === "accepted" ? "bg-green-100" : app?.status === "rejected" ? "bg-red-100" : "bg-yellow-50"}`}>{app.status}</td>

                {/* Actions */}
                <td className="border px-4 py-2">
                  <Link href={`/${lang}/admin/application/${app.application_id}`} passHref>
                    <button className="text-blue-600 hover:underline">
                      {dict.admin.view_details}
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                {dict.admin.no_applications}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
