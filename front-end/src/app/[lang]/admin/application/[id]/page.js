"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ApplicationPage() {
  const { user, token } = useUser();
  const { dict } = useLanguage();
  const router = useRouter();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) return; // Ensure user and token are available

    if (user.role !== "recruiter") {
      router.push("/"); // Redirect non-recruiters
      return;
    }

    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/application/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Application fetched:", response.data.data);
        setApplication(response.data.data);
      } catch (err) {
        console.error("Error fetching application:", err.response?.data || err);
        setError(dict.admin.error_fetching_application);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user, token, id, router]);

  if (loading) return <p className="text-center mt-10">{dict.admin.loading}</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{dict.admin.application_details} #{application?.application_id}</h1>

      <div className="border rounded-lg p-6 bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">{dict.admin.applicant}</h2>
        <p>{application?.applicant?.name} {application?.applicant?.surname}</p>
        <p>{application?.applicant?.email}</p>
      </div>

      <div className="border rounded-lg p-6 bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">{dict.admin.competences}</h2>
        <ul>
          {application?.competences?.map((comp, index) => (
            <li key={index}>{comp?.name} ({comp.years_of_experience} {dict.admin.years})</li>
          ))}
        </ul>
      </div>

      <div className="border rounded-lg p-6 bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">{dict.admin.availability}</h2>
        <ul>
          {application?.availability?.map((avail, index) => (
            <li key={index}>{avail.from_date} → {avail.to_date}</li>
          ))}
        </ul>
      </div>

      <div className="border rounded-lg p-6 bg-gray-100">
        <h2 className="text-lg font-semibold">{dict.admin.status}</h2>
        <p className="capitalize">{application?.status}</p>
      </div>
    </div>
  );
}
