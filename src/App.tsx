import { useState } from "react";
import "./App.css";
import Companies, {
	COMPANIES_TYPES,
} from "./FavoriteCompaniesSelect/Companies";

function App() {
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [companyUsers] = useState({
		null: 2738,
		GVC: 40,
		GCS: 4,
		MVT: 25,
		PTC: 46,
		ITA: 25,
		ICP: 18,
		MVP: 18,
		MAG: 78,
	});

	return (
		<div>
			<Companies
				companyType={[COMPANIES_TYPES.AFFILIATE]}
				showCountValues
				fullText
				variant="standard"
				changeCompany={setSelectedCompanies}
				company_ids={selectedCompanies}
			/>
			<Companies
				companyType={[COMPANIES_TYPES.AFFILIATE, COMPANIES_TYPES.CONTRACT]}
				className={"driver-companies"}
				allName="All"
				label="Companies"
				company_ids={selectedCompanies}
				changeCompany={setSelectedCompanies}
			/>
			<Companies
				fullText={true}
				companyType={[COMPANIES_TYPES.AFFILIATE]}
				allName={"All Companies"}
				className={"header-rides__companies"}
				showCountValues
				variant="standard"
				company_ids={selectedCompanies}
				changeCompany={setSelectedCompanies}
			/>
			<Companies
				companyType={[COMPANIES_TYPES.AFFILIATE]}
				showCountValues
				fullText
				variant="standard"
				company_ids={selectedCompanies}
				changeCompany={setSelectedCompanies}
				allName={"All Companies"}
			/>
			<Companies
				fullText
				companyType={[COMPANIES_TYPES.AFFILIATE]}
				allName={"All Companies"}
				className={"header-rides__companies"}
				variant="standard"
				company_ids={selectedCompanies}
				changeCompany={setSelectedCompanies}
				getCompanyStats={(company) => companyUsers[company.name] || 0}
			/>
		</div>
	);
}

export default App;
