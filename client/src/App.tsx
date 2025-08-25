import { useState, useEffect } from 'react';
import { Search, Building2  } from 'lucide-react';
import type { Company } from './types';
import { CompanyCard } from './components/CompanyCard';
import axios from 'axios';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  
  const fetchAllCompanyDetails = async () => {
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/totalCompaniesCount`);
    const companyCnt = data.total;
    console.log(companyCnt)

    const requests = [];

    for (let index = 1; index <= companyCnt; index++) {
      requests.push(axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/companyDetails`, { id: index }));
    }

    // Set a count to track how many responses have been received
    let responseCount = 0;

    try {
      for (let index = 0; index < requests.length; index++) {
        const response = await requests[index];
        const company = response.data;

        // Ensure no duplicate companies are added
        setCompanies(prevCompanies => {
          const uniqueCompanies = new Set(prevCompanies.map(comp => comp.id));
          if (!uniqueCompanies.has(company.id)) {
            return [...prevCompanies, company];
          }
          return prevCompanies;
        });

        responseCount++;
        // You can optionally update the loading state after a few companies have been fetched
        if (responseCount === requests.length) {
        }
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  useEffect(()=>{
    fetchAllCompanyDetails();
  },[])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company["Job Title"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || company.Type === selectedType;
    const matchesBranch = !selectedBranch || company["Branches Allowed"].includes(selectedBranch);

    return matchesSearch && matchesType && matchesBranch;
  });

 const allBranches = Array.from(
  new Set(
    companies.flatMap(company => Array.isArray(company["Branches Allowed"]) ? company["Branches Allowed"] : [])
  )
).sort();

const allTypes = Array.from(
  new Set(
    companies.map(company => company?.Type || "")
  )
).filter(type => type !== "").sort();


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Campus Job Opportunities
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies, positions, or locations..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              key={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {allTypes.length>0 && allTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {allBranches.length>0 &&  allBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies && filteredCompanies.length>0 && filteredCompanies?.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No companies found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;