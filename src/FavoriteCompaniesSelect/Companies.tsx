import type React from "react";
import { useMemo, useState, useCallback } from "react";

import {
	CircularProgress,
	FormControl,
	Icon,
	IconButton,
	Input,
	InputLabel,
	MenuItem,
} from "@mui/material";
import Select from "../Select/Select";

import type { Company } from "../services/app/reducer";
import { actions } from "../services";
import type { RootState } from "../createStore";
import company_stats_data from "../mock/compnies_stats.json";

import "./companies.css";
import { useSelector } from "react-redux";

export const COMPANIES_TYPES = {
	AFFILIATE: "affiliate",
	CONTRACT: "contract",
} as const;

type CompanyType = (typeof COMPANIES_TYPES)[keyof typeof COMPANIES_TYPES];

interface CompanyStats {
	[companyId: number]: {
		routes_count: number;
	};
}

interface CompaniesProps {
	company_ids: number[];
	changeCompany: (ids: number[]) => void;
	allName?: string;
	showCountValues?: boolean;
	hideStats?: boolean;
	fullText?: boolean;
	className?: string;
	variant?: "standard" | "outlined" | "filled";
	label?: string;
	companyType?: CompanyType[];
	getCompanyStats?: (company: Company) => number;
	onClose?: () => void;
	onOpen?: () => void;
}

const ALL_DATA_FORMAT = { key: 0, value: "all", title: "All Companies" };
const COMPANY_STATS: CompanyStats = company_stats_data;
const INPUT_PROPS = { name: "company_ids" };
const INPUT_LABEL_STYLE_PROPS = { background: "#fff" };

const renderMenuItem = ({
	id,
	title,
	icon,
	color,
	toggleFunction,
	isProcessing = false,
}: {
	id: number;
	title: string;
	icon: string;
	color: string;
	toggleFunction?: (e: React.MouseEvent, id: number) => void;
	isProcessing?: boolean;
}) => (
	<MenuItem key={id} value={id} sx={{ pt: "2px", pb: "2px" }}>
		<IconButton
			className="favourite-icon"
			size="small"
			color="primary"
			onClick={(event) => toggleFunction?.(event, id)}
		>
			<Icon style={{ color }}>
				{isProcessing ? (
					<CircularProgress style={{ maxWidth: 24, maxHeight: 24 }} />
				) : (
					icon
				)}
			</Icon>
		</IconButton>
		<div style={{ width: "100%", padding: "8px 5px" }}>{title}</div>
	</MenuItem>
);

const Companies: React.FC<CompaniesProps> = (props) => {
	const companies = useSelector((state: RootState) => state.app.companies);

	const [selectedFavoriteCompanies, setSelectedFavoriteCompanies] = useState<
		number[]
	>([]);

	const filteredCompaniesByType = useMemo(
		(): Company[] =>
			props.companyType
				? companies.filter((company) =>
						props.companyType?.includes(company.type),
					)
				: companies,
		[props, companies],
	);

	const onChange = useCallback(
		({ target: { value } }: { target: { value: number[] } }) =>
			props.changeCompany(value.includes(ALL_DATA_FORMAT.key) ? [] : value),
		[props],
	);

	const favoriteCompanies = useMemo(
		() => actions.appActions.getFavoriteCompanies()(),
		[],
	);

	const options = useMemo(() => {
		const favIds = new Set(favoriteCompanies);
		return [
			renderMenuItem({
				id: ALL_DATA_FORMAT.key,
				// name: company.name,
				title: ALL_DATA_FORMAT.title,
				icon: "star",
				color: "rgb(203, 15, 21)",
			}),
			...filteredCompaniesByType
				.filter((c) => !favIds.has(c.id))
				.map((company: Company) => {
					const stats = props.getCompanyStats
						? props.getCompanyStats(company)
						: COMPANY_STATS[company.id]?.routes_count || 0;

					return renderMenuItem({
						id: company.id,
						// name: company.name,
						title: `${company.name}${props.hideStats ? "" : ` - ${stats}`}`,
						icon: selectedFavoriteCompanies.includes(company.id)
							? "star"
							: "star_outline",
						color: "rgba(99,97,97,0.89)",
						toggleFunction: () => {
							setSelectedFavoriteCompanies((prev) =>
								prev.includes(company.id)
									? prev.filter((id) => id !== company.id)
									: [...prev, company.id],
							);
						},
						isProcessing: false,
					});
				}),
		];
	}, [
		favoriteCompanies,
		filteredCompaniesByType,
		props,
		selectedFavoriteCompanies,
	]);

	const renderValue = useCallback(() => {
		if (props.showCountValues)
			return props.company_ids?.length === 0
				? props.allName || "All"
				: `${props.company_ids?.length} ${
						props.fullText
							? props.company_ids?.length > 1
								? "Companies"
								: "Company"
							: "Comp"
					}`;
		return props.company_ids.length === 0 ||
			props.company_ids.includes(ALL_DATA_FORMAT.key) ? (
			<>{props.allName || ALL_DATA_FORMAT.title}</>
		) : (
			filteredCompaniesByType
				.filter((c) => props.company_ids.includes(c.id))
				.map((c) => c.name)
				.join(", ")
		);
	}, [props, filteredCompaniesByType]);

	return (
		<FormControl
			variant="outlined"
			className={`companies-select ${props.className || ""}`}
		>
			{props.label && (
				<InputLabel shrink htmlFor="company_id" style={INPUT_LABEL_STYLE_PROPS}>
					{props.label}
				</InputLabel>
			)}

			<Select
				label="favorite companies"
				className="companies-select"
				labelId="favorite_companies_select"
				id="favorite_companies_select_id"
				multiple
				inputProps={INPUT_PROPS}
				displayEmpty
				value={props.company_ids}
				changed={onChange}
				input={<Input />}
				renderValue={renderValue}
				onClose={props.onClose}
				variant={props.variant || "outlined"}
				onOpen={props.onOpen}
			>
				{options}
			</Select>
		</FormControl>
	);
};

export default Companies;
