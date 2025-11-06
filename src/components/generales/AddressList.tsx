import React from 'react';
import { AddressListProps, ADDRESS_LIST_CONFIG } from '../../types/enums';

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onRemove,
  onSearch,
  isLoading,
  minCount = 1,
  hasResult = false
}) => {
  return (
    <div className="mb-4">
      <AddressListHeader addressCount={addresses.length} />
      
      {addresses.length === 0 ? (
        <EmptyAddressList />
      ) : (
        <AddressGrid addresses={addresses} onRemove={onRemove} isLoading={isLoading} />
      )}
      
      {!hasResult && (
        <SearchButton 
          onSearch={onSearch}
          isLoading={isLoading}
          addressCount={addresses.length}
          minCount={minCount}
        />
      )}
    </div>
  );
};

const AddressListHeader: React.FC<{ addressCount: number }> = ({ addressCount }) => (
  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
    {ADDRESS_LIST_CONFIG.TITLE} ({addressCount})
  </h2>
);

const EmptyAddressList: React.FC = () => (
  <p className="text-gray-500 dark:text-gray-400 italic">
    {ADDRESS_LIST_CONFIG.EMPTY_MESSAGE}
  </p>
);

const AddressGrid: React.FC<{
  addresses: string[];
  onRemove: (index: number) => void;
  isLoading:boolean;
}> = ({ addresses, onRemove, isLoading }) => (
  <ul className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    {addresses.map((address, index) => (
      <AddressItem 
        key={index}
        address={address}
        index={index}
        onRemove={onRemove}
        isLoading={isLoading}
      />
    ))}
  </ul>
);

const AddressItem: React.FC<{
  address: string;
  index: number;
  onRemove: (index: number) => void;
  isLoading:boolean;
}> = ({ address, index, onRemove, isLoading }) => (
  <li className="flex justify-between items-center py-1 mb-2 bg-gray-100 dark:bg-gray-700">
    <AddressText address={address} />
    <RemoveButton onClick={() => onRemove(index)} disabled={isLoading} />
  </li>
);

const AddressText: React.FC<{ address: string }> = ({ address }) => (
  <span className="text-gray-800 dark:text-gray-100 text-sm p-2">{address}</span>
);

const RemoveButton: React.FC<{ onClick: () => void; disabled:boolean }> = ({ onClick, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={`text-red-600 p-2 rounded transition-colors duration-200 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-800 hover:bg-red-50'}`}
    aria-label="Eliminar dirección"
    disabled={disabled}
  >
    ✕
  </button>
);

const SearchButton: React.FC<{
  onSearch: () => void;
  isLoading: boolean;
  addressCount: number;
  minCount: number;
}> = ({ onSearch, isLoading, addressCount, minCount }) => {
  const isDisabled = isLoading || addressCount < minCount;
  const [cooldown,setCooldown]=React.useState(false);
  const handleClick=()=>{
    if(cooldown||isDisabled) return;
    setCooldown(true);
    onSearch();
    setTimeout(()=>setCooldown(false),1500);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`mt-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#0369A1] text-white hover:bg-blue-700'
      }`}
      disabled={isDisabled||cooldown}
    >
      {isLoading ? ADDRESS_LIST_CONFIG.BUTTON_LOADING : ADDRESS_LIST_CONFIG.BUTTON_TEXT}
    </button>
  );
};

export default AddressList; 