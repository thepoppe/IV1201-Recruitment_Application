"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * AdminPage component for recruiters to view and manage job applications.
 * 
 * This client-side component fetches and displays all job applications in a table format.
 * It includes authentication checks to ensure only users with the 'recruiter' role can access it.
 * If a non-recruiter attempts to access this page, they are redirected to the home page.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminPage component
 */
export default function AdminPage() {
  const { user, token } = useUser();
  const { dict, lang } = useLanguage();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('application_id');
  const [sortDirection, setSortDirection] = useState('asc');

  /**
   * Effect hook that handles authorization and fetches application data.
   *
   * Checks if the user has recruiter role and redirects if not.
   * Fetches all applications from the API if the user is authorized.
   *
   * @effect
   * @dependency {Object} user - Current user object
   * @dependency {string} token - Authentication token
   * @dependency {Object} router - Next.js router
   */
  useEffect(() => {
    if (!user || !token) return; // Ensure user and token are available

    if (user.role !== "recruiter") {
      router.push("/"); // Redirect non-recruiters
      return;
    }

    /**
     * Fetches all applications from the API
     *
     * @async
     * @function fetchApplications
     * @returns {Promise<void>}
     */
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

  /**
   * Handles sorting when a column header is clicked
   * 
   * @function handleSort
   * @param {string} field - The field to sort by
   */
  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Returns applications sorted by the current sort field and direction
   * 
   * @function getSortedApplications
   * @returns {Array} Sorted array of applications
   */
  const getSortedApplications = () => {
    return [...applications].sort((a, b) => {
      let valueA, valueB;
      
      // Extract the values based on the sort field
      switch (sortField) {
        case 'application_id':
          valueA = a.application_id;
          valueB = b.application_id;
          break;
        case 'name':
          valueA = `${a.applicant.name} ${a.applicant.surname}`;
          valueB = `${b.applicant.name} ${b.applicant.surname}`;
          break;
        case 'email':
          valueA = a.applicant.email;
          valueB = b.applicant.email;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a[sortField];
          valueB = b[sortField];
      }
      
      // Handle string comparison
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      // Apply sort direction
      return sortDirection === 'asc' 
        ? (valueA > valueB ? 1 : valueA < valueB ? -1 : 0)
        : (valueA < valueB ? 1 : valueA > valueB ? -1 : 0);
    });
  };

  /**
   * Renders sorting indicator next to column header
   * 
   * @function renderSortIndicator
   * @param {string} field - The field to check
   * @returns {string} The sort indicator arrow
   */
  const renderSortIndicator = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (loading) return <p className="text-center mt-10">{dict.admin.loading}</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{dict.admin.title}</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th 
              className="border px-4 py-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort('application_id')}
            >
              {dict.admin.id}{renderSortIndicator('application_id')}
            </th>
            <th 
              className="border px-4 py-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort('name')}
            >
              {dict.admin.applicant}{renderSortIndicator('name')}
            </th>
            <th 
              className="border px-4 py-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort('email')}
            >
              {dict.admin.email}{renderSortIndicator('email')}
            </th>
            <th className="border px-4 py-2">{dict.admin.competences}</th>
            <th className="border px-4 py-2">{dict.admin.availability}</th>
            <th 
              className="border px-4 py-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort('status')}
            >
              {dict.admin.status}{renderSortIndicator('status')}
            </th>
            <th className="border px-4 py-2">{dict.admin.actions}</th>
          </tr>
        </thead>
        <tbody>
          {getSortedApplications().length > 0 ? (
            getSortedApplications().map((app) => (
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
              <td colSpan="7" className="text-center py-4 text-gray-500">
                {dict.admin.no_applications}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}