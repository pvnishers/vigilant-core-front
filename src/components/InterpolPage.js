import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InterpolPersonCard from './InterpolPersonCard';
import PaginationComponent from './PaginationComponent';
import InterpolFilterForm from './InterpolFilterForm';  // Importe o componente de filtro

const InterpolPage = () => {
  const [interpolPersons, setInterpolPersons] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    nameForename: '',
    nationality: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.entries(appliedFilters).map(([key, value]) => `${key}=${value}`).join('&');
      try {
        const response = await fetch(
          `https://vigilant-api-a2xyukeyka-uc.a.run.app/interpol/getallnotices?page=${currentPage}&${queryString}`
        );
        if (response.ok) {
          const data = await response.json();
          setInterpolPersons(data.notices);
          setTotalRecords(data.totalRecords);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da Interpol:', error);
      }
    };

    fetchData();
  }, [currentPage, appliedFilters]);

  const handlePageChange = (selectedPage) => {
    const nextPage = selectedPage.selected + 1;
    navigate(`?page=${nextPage}`);
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-3">
          <InterpolFilterForm filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        </div>
        <div className="col-md-9">
          <div className="row">
            {interpolPersons.map((person) => (
              <div key={person.id} className="col-md-4">
                <InterpolPersonCard person={person} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <PaginationComponent
        pageCount={Math.ceil(totalRecords / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InterpolPage;
