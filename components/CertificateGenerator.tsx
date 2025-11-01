'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Certificate } from '@/types';
import { formatDate } from '@/lib/utils/date';

interface CertificateGeneratorProps {
  certificate: Certificate;
  onGenerate?: (blob: Blob) => void;
}

export default function CertificateGenerator({ certificate, onGenerate }: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Convert to blob if callback provided
      if (onGenerate) {
        const blob = pdf.output('blob');
        onGenerate(blob);
      } else {
        // Otherwise, download directly
        pdf.save(`certificate-${certificate.verificationCode}.pdf`);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div>
      <div ref={certificateRef} className="certificate-container bg-white">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-primary-700 mb-2">
            Certificate of Completion
          </h1>
          <div className="w-32 h-1 bg-primary-600 mx-auto"></div>
        </div>

        <div className="text-center space-y-6 my-12">
          <p className="text-2xl text-gray-700">This certifies that</p>
          <p className="text-5xl font-bold text-gray-900">{certificate.studentName}</p>
          <p className="text-2xl text-gray-700">has successfully completed</p>
          <p className="text-4xl font-semibold text-primary-700">
            {certificate.challengeTitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Mentor</p>
            <p className="text-xl font-semibold text-gray-900">{certificate.mentorName}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Date Issued</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatDate(certificate.issueDate, 'PPP')}
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Verification Code: <span className="font-mono font-semibold">{certificate.verificationCode}</span>
          </p>
        </div>

        {certificate.skills.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-3">Skills Demonstrated</p>
            <div className="flex flex-wrap justify-center gap-2">
              {certificate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={generatePDF}
        className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition"
      >
        Download Certificate
      </button>
    </div>
  );
}

