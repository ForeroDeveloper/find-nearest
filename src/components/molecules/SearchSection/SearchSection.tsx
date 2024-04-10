import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ChangeEvent, useEffect, useRef, useState } from "react";
import {
  faSearch,
  faCalendar,
  faPeopleGroup,
  faHandHoldingDollar,
  faFilter,
  faTreeCity,
} from "@fortawesome/free-solid-svg-icons";

import { Country } from "./types";
import cityMock from "../../../assets/images/bay-minette.webp";
import citiesDataMock from "../../../mocks/cities.json";

const PAGE_SIZE_COUNTRYS = 10;
const filterOptions = [
  "Foodle",
  "Indoor Activities",
  "Cultural",
  "History",
  "Kiddies",
  "Outdoor Activities",
];
export const SearchSection: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<any | undefined>(undefined);
  const [filteredClients, setFilteredClients] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<any>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option: Country) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleClickInput = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
    toggleDropdown();
  };

  const loadInitialData = (): void => {
    const startIndex = 0;
    const endIndex = PAGE_SIZE_COUNTRYS;
    const initialResults = citiesDataMock.slice(startIndex, endIndex);
    setFilteredClients(initialResults);
    setCurrentPage(1);
  };

  const loadMoreData = () => {
    if (loading) return;
    setLoading(true);

    const startIndex = currentPage * PAGE_SIZE_COUNTRYS;
    const endIndex = startIndex + PAGE_SIZE_COUNTRYS;
    const newResults = citiesDataMock
      .filter((client) =>
        client.name.toLowerCase().includes(clientSearch.toLowerCase())
      )
      .slice(startIndex, endIndex);

    setFilteredClients((prevResults) => [...prevResults, ...newResults]);
    setCurrentPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    if(selectedOption && event.target.value.length < 1){
      setClientSearch('');
      setSelectedOption(null);
    }
    const searchTerm = event.target.value.toLowerCase();
    setClientSearch(searchTerm);
    setCurrentPage(1);
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const filtered = citiesDataMock
        .filter((client) => client.name.toLowerCase().includes(searchTerm))
        .slice(0, PAGE_SIZE_COUNTRYS);
      setFilteredClients(filtered);
    }, 300);
  };

  const calculateDistance = (
    lat1: string,
    lon1: string,
    lat2: string,
    lon2: string
  ) => {
    const R = 6371;
    const dLat = deg2rad(Number(lat2) - Number(lat1));
    const dLon = deg2rad(Number(lon2) - Number(lon1));
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(Number(lat1))) *
        Math.cos(deg2rad(Number(lat2))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const findNearestPoints = (
    selectedPoint: Country | null,
    allPoints: Country[]
  ): Country[] => {
    if (!selectedPoint) {
      return [];
    }
    const { lat: selectedLat, lng: selectedLng } = selectedPoint;
    return allPoints
      .map((point) => ({
        ...point,
        distance: calculateDistance(
          selectedLat,
          selectedLng,
          point.lat,
          point.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (
        container &&
        container.scrollTop + container.clientHeight >= container.scrollHeight
      ) {
        loadMoreData();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isOpen]);

  return (
    <div
      className="w-3/5 h-full box-border flex flex-col"
      data-testid="search-section"
    >
      <div className="flex justify-between items-center px-4">
        <div className="flex items-start justify-left gap-2 w-full mt-2">
          <div className="w-full">
            <div className="relative w-full flex flex-row" ref={dropdownRef}>
              <div className="absolute rounded-full bg-neutral w-8 h-8 items-center flex justify-center cursor-pointer left-2 mt-2">
                <div tabIndex={0} role="button">
                  <FontAwesomeIcon icon={faSearch} size="1x" color="gray" />
                </div>
              </div>
              <input
                data-testid="search-input"
                type="text"
                ref={inputRef}
                value={clientSearch || selectedOption?.name || ""}
                onClick={handleClickInput}
                onChange={handleSearch}
                className="w-full py-3 pl-12 pr-8 border-2 border-[#B6D2CC] rounded-md focus:outline-none bg-white"
              />
              {isOpen && (
                <div
                  className="absolute z-10 mt-14 w-full rounded-md bg-white shadow-lg max-h-40 overflow-auto"
                  ref={containerRef}
                >
                  {filteredClients.map(
                    (
                      option,
                      index // Index no recomendado pero para este ejemplo no tenemos id.
                    ) => (
                      <div
                        data-testid={`option-city-${index}`}
                        key={index}
                        onClick={() => handleSelectOption(option)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {option?.name}
                      </div>
                    )
                  )}
                  {loading && <div>Loading...</div>}
                </div>
              )}
            </div>
            <div className="w-full bg-white mt-2 rounded-md border-2 border-[#B6D2CC] p-4 h-[188px] justify-left items-center flex">
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      size="lg"
                      color="#1DDF81"
                    />
                    <span className="text-sm font-semibold text-secondary">
                      Date
                    </span>
                  </div>
                  <span className="text-sm font-bold text-secondary">
                    09 APR, 2024
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <FontAwesomeIcon
                      icon={faPeopleGroup}
                      size="lg"
                      color="#1DDF81"
                    />
                    <span className="text-sm font-semibold text-secondary">
                      People
                    </span>
                  </div>
                  <span className="text-sm font-bold text-secondary">
                    3 Adult, 2 Child
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex gap-2">
                      <FontAwesomeIcon
                        icon={faHandHoldingDollar}
                        size="lg"
                        color="#1DDF81"
                      />
                      <span className="text-sm font-semibold text-secondary">
                        Price
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-bold text-secondary">
                        Min:
                      </span>
                      <input
                        type="text"
                        defaultValue="$43"
                        className="w-12 px-2 border-2 border-[#B6D2CC] rounded-md focus:outline-none bg-white"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-bold text-secondary">
                        Max:
                      </span>
                      <input
                        type="text"
                        defaultValue="$43"
                        className="w-12 px-2 border-2 border-[#B6D2CC] rounded-md focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-64">
            <div className="border-[2px] border-[#B6D2CC] bg-white rounded-lg h-11 items-center flex justify-left px-4 gap-2 cursor-pointer">
              <FontAwesomeIcon icon={faFilter} size="lg" color="#1DDF81" />
              <span className="text-sm font-semibold text-secondary">
                Filter
              </span>
            </div>
            <div className="bg-white w-full h-auto mt-[-4px] rounded-b-md border-[2px] border-[#B6D2CC]">
              {filterOptions.map((option, index) => (
                <div key={index} className="cursor-pointer">
                  <div className="border-t-2"></div>
                  <div className="px-2 py-1">
                    <span className="text-sm font-medium text-secondary">
                      {option}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-bold pl-6 mt-4">Nearby places</h2>

      <div className="overflow-auto p-4 rounded-md border-2 border-[#B6D2CC] bg-white m-4 min-h-40">
        {findNearestPoints(selectedOption, citiesDataMock).map(
          (option, index) => (
            <div
              key={index}
              className="flex justify-between w-full py-4 px-4 hover:bg-gray-200 hover:rounded-md cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-secondary">
                  Jobs fill your pocket.
                  <br /> Adventures fill your soul
                </span>
                <span className="text-sm font-medium text-secondary">
                  Jaime Lyn Beatty
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-secondary">
                  Enjoy the beautiful <br /> of the.
                </span>
                <span className="text-sm font-medium text-orange-400">
                  {option?.name}
                </span>
                <span className="text-xs font-medium text-secondary">
                  Lat: {option.lat} - long: {option.lng}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <img
                  src={cityMock}
                  alt="city"
                  className="rounded-lg border-2 border-[#B6D2CC]"
                  width="100px"
                  height="auto"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-2 mt-4 mr-2">
                <div className="flex gap-2">
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-4"
                      className="mask mask-star-2 bg-green-500"
                    />
                    <input
                      type="radio"
                      name="rating-4"
                      className="mask mask-star-2 bg-green-500"
                    />
                    <input
                      type="radio"
                      name="rating-4"
                      className="mask mask-star-2 bg-green-500"
                    />
                    <input
                      type="radio"
                      name="rating-4"
                      className="mask mask-star-2 bg-green-500"
                      checked
                    />
                    <input
                      type="radio"
                      name="rating-4"
                      className="mask mask-star-2 bg-green-500"
                    />
                  </div>
                  <span className="text-sm font-semibold text-secondary">
                    4.5
                  </span>
                </div>
                <span className="text-sm font-bold text-secondary">
                  Total person: 6.0k
                </span>
              </div>
            </div>
          )
        )}
        {!selectedOption && (
          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-lg font-bold text-secondary text-center">
              Search city...
            </h2>
            <FontAwesomeIcon icon={faTreeCity} size="3x" color="#1DDF81" />
          </div>
        )}
      </div>
      <p className="text-secondary px-4 font-extralight text-sm">
        By: Jeferson Forero - Developer FullStack
      </p>
    </div>
  );
};
