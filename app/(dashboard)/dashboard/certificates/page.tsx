'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getCertificatesByStudent } from '@/lib/firebase/certificate-service';
import { Certificate } from '@/types';
import { formatDate } from '@/lib/utils/date';
import { FiAward, FiDownload, FiExternalLink } from 'react-icons/fi';

export default function CertificatesPage() {
  const { user } = useUser();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      if (!user) return;

      try {
        const data = await getCertificatesByStudent(user.id);
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">
          View and download your earned certificates
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiAward className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {certificate.challengeTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Issued by {certificate.mentorName}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  Date: {formatDate(certificate.issueDate, 'PP')}
                </p>
                <p className="text-xs text-gray-500">
                  Code: <span className="font-mono">{certificate.verificationCode}</span>
                </p>
              </div>

              {certificate.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {certificate.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{certificate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={certificate.certificateUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  Download
                </a>
                <a
                  href={certificate.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiAward className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600">
            Complete challenges and earn certificates to showcase your skills
          </p>
        </div>
      )}
    </div>
  );
}

