// @ts-check
import React, { useState } from 'react';
import Select from '../Select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../services';
import {
  CircularProgress,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
} from '@mui/material';
import './companies.css';
import company_stats_data from '../mock/compnies_stats.json';

export const COMPANIES_TYPES = {
  AFFILIATE: 'affiliate',
  CONTRACT: 'contract',
};
const Companies = props => {
  const ALL_DATA_FORMAT = { key: 0, value: 'all', title: 'All Companies' };
  const companies = useSelector(state => state.app.companies);
  const company_stats = company_stats_data; // useSelector((state) => state.rides.companies);
  const dispatch = useDispatch();
  const setFavoriteCompanies = data =>
    dispatch(actions.appActions.setFavoriteCompanies(data));
  const getFavoriteCompanies = () =>
    dispatch(actions.appActions.getFavoriteCompanies());
  const [favorite_companies, set_favorite_companies] = useState([]);
  const [res, set_res] = useState([]);
  const [companies_by_types, set_companies_by_types] = useState([]);

  const getFavouriteNotByType = () => {
    const generalFavorite = getFavoriteCompanies();
    const favoriteForSaving = generalFavorite.filter(
      x => !companies_by_types.map(item => item.id).includes(x),
    );
    return favoriteForSaving;
  };

  const getCompaniesByType = () =>
    props.companyType
      ? companies.filter(company => props.companyType.includes(company.type))
      : companies;

  const toggleFavoriteCompanies = (e, companyId) => {
    e.stopPropagation();
    set_favorite_companies(prevState =>
      prevState.includes(companyId)
        ? prevState.filter(item => item !== companyId)
        : [...prevState, companyId],
    );
  };

  const getIntersection = () => {
    const a = new Set(companies_by_types);
    const b = new Set(getFavoriteCompanies());
    return [...new Set([...a].filter(x => b.has(x.id)))];
  };

  const toggleResCompanies = (e, companyId) => {
    e.stopPropagation();
    set_res(prevState =>
      prevState.includes(companyId)
        ? prevState.filter(item => item !== companyId)
        : [...prevState, companyId],
    );
  };

  const getChosenFavouriteItems = company => {
    const basicCompanyStats = company_stats.hasOwnProperty(company.id)
      ? company_stats[company.id].routes_count
      : 0;
    const companyStats =
      typeof props.getCompanyStats === 'function'
        ? props.getCompanyStats(company)
        : basicCompanyStats;
    return getMenuItem({
      id: company.id,
      name: company.name,
      title: `${company.name}${!props.hideStats ? ' - ' + companyStats : ''}`,
      icon: res.includes(company.id) ? 'star_outline' : 'star',
      color: 'rgb(255, 179, 0)',
      toggleFunction: toggleResCompanies,
    });
  };

  const getAllInfoMenuItem = () =>
    getMenuItem({
      id: ALL_DATA_FORMAT.key,
      name: ALL_DATA_FORMAT.value,
      title: ALL_DATA_FORMAT.title,
      icon: 'star',
      color: 'rgb(203, 15, 21)',
    });

  const getMenuItem = ({
    id,
    name,
    title,
    icon,
    color,
    toggleFunction = () => {},
    isProcessing = false,
  }) => (
    <MenuItem sx={{ pt: '2px', pb: '2px' }} key={id} value={id}>
      <IconButton
        className={'favourite-icon'}
        size={'small'}
        color="primary"
        onClick={event => toggleFunction(event, id)}
      >
        <Icon style={{ color }}>
          {isProcessing ? (
            <CircularProgress style={{ maxWidth: 24, maxHeight: 24 }} />
          ) : (
            icon
          )}
        </Icon>
      </IconButton>
      <div id={id} style={{ width: '100%', padding: '8px 5px' }}>
        {title}
      </div>
    </MenuItem>
  );

  const getValue = () => {
    if (
      props.company_ids.length === 0 ||
      props.company_ids.some(item => item === ALL_DATA_FORMAT.key)
    ) {
      return <>{props.allName || ALL_DATA_FORMAT.title}</>;
    }
    return getSelectedCompaniesNames();
  };

  const getSelectedCompaniesNames = () => {
    const intersection = [
      ...new Set(
        getCompaniesByType().filter(x => new Set(props.company_ids).has(x.id)),
      ),
    ].map(item => item.name);
    return [...intersection].join(', ');
  };

  const getDiff = () =>
    companies_by_types.filter(x => !getFavoriteCompanies().includes(x.id));

  const getNotCurrentFavoriteItems = company => {
    const basicCompanyStats = company_stats.hasOwnProperty(company.id)
      ? company_stats[company.id].routes_count
      : 0;
    const companyStats =
      typeof props.getCompanyStats === 'function'
        ? props.getCompanyStats(company)
        : basicCompanyStats;
    return getMenuItem({
      id: company.id,
      name: company.name,
      title: `${company.name}${!props.hideStats ? ' - ' + companyStats : ''}`,
      icon: favorite_companies.includes(company.id) ? 'star' : 'star_outline',
      color: 'rgba(99,97,97,0.89)',
      toggleFunction: toggleFavoriteCompanies,
      isProcessing: false,
    });
  };

  const areSetsEqual = (a, b) =>
    a.size === b.size && [...a].every(value => b.has(value));

  const setFavouriteData = data => {
    const prevFavourite = new Set(getFavoriteCompanies());
    const currentFavourite = new Set(data);
    if (!areSetsEqual(prevFavourite, currentFavourite)) {
      setFavoriteCompanies([...new Set(data)]);
    }
  };

  const setResDate = () =>
    getIntersection()
      .filter(x => !res.includes(x.id))
      .map(item => item.id);

  const update = ({ target: { value } }) => {
    props.changeCompany(
      value.length > 0 && value.slice(-1)[0] === ALL_DATA_FORMAT.key
        ? []
        : value,
    );
  };

  const onClose = () => {
    setFavouriteData([
      ...favorite_companies,
      ...setResDate(),
      ...getFavouriteNotByType(),
    ]);
    set_favorite_companies([]);
    set_res([]);
    props.onClose && props.onClose();
  };

  const onOpen = () => {
    set_companies_by_types(getCompaniesByType());
    props.onOpen && props.onOpen();
  };

  const getCountValues = ({ length }) => {
    if (length === 0) {
      return props.allName || 'All';
    }
    return `${length} ${
      props.fullText ? (length > 1 ? 'Companies' : 'Company') : 'Comp'
    }`;
  };

  return (
    <FormControl
      variant="outlined"
      className={`companies-select ${props.className}`}
    >
      {props.label && (
        <InputLabel
          shrink={true}
          htmlFor="company_id"
          style={{ backgroundColor: 'white' }}
        >
          {props.label}
        </InputLabel>
      )}
      <Select
        label={'favorite companies'}
        className={'companies-select'}
        labelId="favorite_companies_select"
        id="favorite_companies_select_id"
        multiple
        inputProps={{
          name: 'company_ids',
        }}
        displayEmpty
        value={[...props.company_ids]}
        changed={update}
        input={<Input />}
        renderValue={props.showCountValues ? getCountValues : getValue}
        onClose={onClose}
        variant={props.variant || 'outlined'}
        onOpen={onOpen}
      >
        {getAllInfoMenuItem()}
        {getIntersection().map(company => getChosenFavouriteItems(company))}
        {getDiff().map(company => getNotCurrentFavoriteItems(company))}
      </Select>
    </FormControl>
  );
};

export default Companies;
