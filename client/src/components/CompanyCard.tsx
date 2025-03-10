import { MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react";
import type { Company } from "../types";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{company.Name}</h3>
          <p className="text-lg text-gray-700 mt-1">{company["Job Title"]}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            company.Type === "Internship"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {company.Type}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{company.Location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Arrival: {company["Arrival Date"]}</span>
        </div>
        {company["Stipend Info"] && (
          <div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Stipend Info:</span>
            </div>
            <div className="pl-6 whitespace-pre-line text-gray-700 text-sm">
              {company["Stipend Info"]}
            </div>
          </div>
        )}
        {company.CGPA > 0 && (
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>Min. CGPA: {company.CGPA}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700">Eligible Branches:</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {company["Branches Allowed"].map((branch,index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              {branch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
