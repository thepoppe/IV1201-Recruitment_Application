"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/ui/Button";

export default function ApplicationPage() {
  const { user, token } = useUser();
  const { dict } = useLanguage();
  const router = useRouter();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const updateStatus = async (newStatus) => {
    // Confirm status update
    if (!confirm(`Are you sure you want to ${newStatus == "accepted" ? "accept" : "reject"} this application?`)) {
      return;
    }

    // Update application status
    setUpdating(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/application/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplication(response.data.data);
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err);
      setError(dict.admin.error_updating_status);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">{dict.admin.loading}</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {dict.admin.application_details} #{application?.application_id}
      </h1>

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

      <div className={`border rounded-lg p-6 mb-6 ${application?.status === "accepted" ? "bg-green-100" : application?.status === "rejected" ? "bg-red-100" : "bg-yellow-50"}`}>
        <h2 className="text-lg font-semibold">{dict.admin.status}</h2>
        <p className="capitalize">{application?.status}</p>
      </div>

      <div className="mt-6 flex justify-end">
        {/* Status Update Buttons */}
        <div className="mt-4 flex gap-4">
          <Button 
            variant="secondary" 
            disabled={updating || application?.status === "accepted"} 
            onClick={() => updateStatus("accepted")}
          >
            {dict.admin.accept}
          </Button>
          <Button 
            variant="danger"
            disabled={updating || application?.status === "rejected"} 
            onClick={() => updateStatus("rejected")}
          >
            {dict.admin.reject}
          </Button>
        </div>
      </div>
    </div>
  );
}
