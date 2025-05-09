import type React from "react";
import { useMemo, useState, useCallback } from "react";

import {
	CircularProgress,
	FormControl,
	Icon,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
} from "@mui/material";

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

interface IP {
	id: number;
	title: string;
	icon: string;
	color: string;
	toggleFunction?: (e: React.MouseEvent) => void;
	isProcessing?: boolean;
	value: number;
}
const RenderMenuItem: React.FC<IP> = ({
	id,
	title,
	icon,
	color,
	toggleFunction,
	isProcessing = false,
	...props
}) => {
	return (
		<MenuItem {...props} key={id} sx={{ pt: "2px", pb: "2px" }}>
			<IconButton
				className="favourite-icon"
				size="small"
				color="primary"
				onClick={toggleFunction}
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
};

const Companies: React.FC<CompaniesProps> = (props) => {
	const companies = useSelector((state: RootState) => state.app.companies);

	const [selectedFavoriteCompanies, setSelectedFavoriteCompanies] = useState<
		number[]
	>([]);
	const [currentFavoritesCompanies, setCurrentFavoritesCompanies] = useState<
		number[]
	>([]);

	const setFavoriteCompanies = (data: number[]) =>
		actions.appActions.setFavoriteCompanies(data)();

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
		({ target: { value } }: SelectChangeEvent<number[]>) => {
			props.changeCompany(
				Array.isArray(value) && value.includes(ALL_DATA_FORMAT.key)
					? []
					: (value as number[]),
			);
		},
		[props],
	);

	const options = useMemo(() => {
		const onToggle =
			(companyId: number) => (e: MouseEvent<Element, MouseEvent>) => {
				e.stopPropagation();
				setCurrentFavoritesCompanies((prev) =>
					prev.includes(companyId)
						? (() => {
								setSelectedFavoriteCompanies((prevSelected) =>
									prevSelected.filter(
										(prevSelectedId) => prevSelectedId !== companyId,
									),
								);
								return prev.filter((id) => id !== companyId);
							})()
						: [...prev, companyId],
				);
			};
		return [
			<RenderMenuItem
				key={ALL_DATA_FORMAT.key}
				id={ALL_DATA_FORMAT.key}
				value={+ALL_DATA_FORMAT.key}
				title={ALL_DATA_FORMAT.title}
				icon="star"
				color="rgb(203, 15, 21)"
			/>,

			...filteredCompaniesByType
				.sort(
					(companyA, companyB) =>
						+selectedFavoriteCompanies.includes(companyB.id) -
						+selectedFavoriteCompanies.includes(companyA.id),
				)
				.map((company: Company) => {
					const stats = props.getCompanyStats
						? props.getCompanyStats(company)
						: COMPANY_STATS[company.id]?.routes_count || 0;

					return (
						<RenderMenuItem
							key={company.id}
							id={company.id}
							title={`${company.name}${props.hideStats ? "" : ` - ${stats}`}`}
							icon={
								currentFavoritesCompanies.includes(company.id) ||
								selectedFavoriteCompanies.includes(company.id)
									? "star"
									: "star_outline"
							}
							value={company.id}
							color={
								selectedFavoriteCompanies.includes(company.id)
									? "rgb(255, 179, 0)"
									: currentFavoritesCompanies.includes(company.id)
										? "rgba(99,97,97,0.89)"
										: ""
							}
							toggleFunction={onToggle(company.id)}
						/>
					);
				}),
		];
	}, [
		selectedFavoriteCompanies,
		filteredCompaniesByType,
		props.getCompanyStats,
		props.hideStats,
		currentFavoritesCompanies,
	]);

	const renderValue = useCallback(() => {
		if (
			!props.company_ids?.length ||
			props.company_ids.includes(ALL_DATA_FORMAT.key)
		) {
			if (props.showCountValues) return props.allName || "All";
			return props.allName || ALL_DATA_FORMAT.title;
		}

		if (props.showCountValues)
			return `${props.company_ids?.length} Compan${
				props.company_ids?.length > 1 ? "ies" : "y"
			}`;

		return filteredCompaniesByType
			.filter((c) => props.company_ids.includes(c.id))
			.map((c) => c.name)
			.join(", ");
	}, [
		props.company_ids,
		props.showCountValues,
		props.allName,
		filteredCompaniesByType,
	]);

	const onClose = useCallback(() => {
		props.onClose?.();
		setFavoriteCompanies(currentFavoritesCompanies);
		setSelectedFavoriteCompanies(currentFavoritesCompanies);
	}, [props.onClose, currentFavoritesCompanies]);

	const onOpen = useCallback(() => {
		const favoritesCompanyArr = actions.appActions.getFavoriteCompanies()();

		setSelectedFavoriteCompanies(favoritesCompanyArr);
		setCurrentFavoritesCompanies(favoritesCompanyArr);
		props?.onOpen?.();
	}, [props?.onOpen]);

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
				className="select-form-control companies-select"
				labelId="favorite_companies_select"
				id="favorite_companies_select_id"
				multiple
				inputProps={INPUT_PROPS}
				displayEmpty
				value={props.company_ids}
				onChange={onChange}
				renderValue={renderValue}
				onClose={onClose}
				variant={props.variant || "outlined"}
				onOpen={onOpen}
			>
				{options}
			</Select>
		</FormControl>
	);
};

export default Companies;
