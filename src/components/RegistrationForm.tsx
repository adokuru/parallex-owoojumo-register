/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Select from 'react-select';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import {
  Region,
  Zone,
  Bank,
  RegistrationFormData,
  ApiResponse,
  AccountValidationResponse,
  RegistrationResponse
} from '@/lib/types';
import { axiosInstance } from '@/lib/api';

interface DropdownOption {
  key: string;
  value: string;
}

const InputWithLabel = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  </div>
);

const TextareaWithLabel = ({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      rows={3}
      {...props}
    />
  </div>
);

interface SelectWithLabelProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
}

const SelectWithLabel = ({
  label,
  options,
  value,
  onChangeValue,
  disabled,
}: SelectWithLabelProps) => {
  const rsOptions = options.map((o) => ({ value: o.key, label: o.value }));
  const selected = rsOptions.find((o) => o.value === value) ?? null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Select
        classNamePrefix="rs"
        isDisabled={disabled}
        isSearchable
        options={rsOptions}
        value={selected}
        placeholder={`Select ${label}`}
        onChange={(opt) => onChangeValue((opt as { value: string; label: string } | null)?.value ?? '')}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: 48,
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
            borderColor: state.isFocused ? '#3B82F6' : '#E5E7EB',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.25)' : 'none',
            ':hover': { borderColor: '#3B82F6' },
          }),
          menu: (base) => ({ ...base, borderRadius: 12, overflow: 'hidden' }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#DBEAFE' : state.isFocused ? '#EFF6FF' : 'white',
            color: '#111827',
          }),
        }}
      />
    </div>
  );
};

const Toast = ({
  message,
  type,
  show,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}>
      {message}
    </div>
  );
};

export default function RegistrationForm() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nin, setNin] = useState('');
  const [bvn, setBvn] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [parallex_id, setParallexId] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });

  // Data state
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await axiosInstance.get<ApiResponse<Region[]>>('/regions');
        if (data.success) {
          setRegions(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };
    fetchRegions();
  }, []);

  // Fetch zones when region changes
  useEffect(() => {
    const fetchZones = async () => {
      if (!selectedRegion) {
        setZones([]);
        return;
      }

      try {
        const { data } = await axiosInstance.get<ApiResponse<Zone[]>>(`/zones/region/${selectedRegion}`);
        if (data.success) {
          setZones(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch zones:', error);
      }
    };
    fetchZones();
  }, [selectedRegion]);

  // Fetch banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axiosInstance.get<ApiResponse<Bank[]>>('/banks');
        if (data.success) {
          setBanks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
      }
    };
    fetchBanks();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const validateBankAccount = useCallback(async () => {
    if (!selectedBank || !accountNumber) {
      showToast('Please select a bank and enter account number', 'error');
      setValidationError('Please select a bank and enter account number');
      return false;
    }

    if (accountNumber.length !== 10) {
      showToast('Account number must be 10 digits', 'error');
      setValidationError('Account number must be 10 digits');
      return false;
    }

    setValidationError('');

    try {
      setIsValidating(true);
      const { data } = await axiosInstance.post<ApiResponse<AccountValidationResponse>>(
        '/validate-account',
        {
          bank_code: selectedBank,
          account_number: accountNumber,
        }
      );

      if (data.success) {
        setAccountName(data.data.account_name);
        return true;
      }

      showToast('Invalid account details', 'error');
      setValidationError('Invalid account details');
      return false;
    } catch {
      showToast('Failed to validate account', 'error');
      setValidationError('Failed to validate account');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [selectedBank, accountNumber]);

  useEffect(() => {
    if (!selectedBank || accountNumber.length !== 10) return;
    const t = setTimeout(() => { void validateBankAccount(); }, 500);
    return () => clearTimeout(t);
  }, [selectedBank, accountNumber, validateBankAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await validateBankAccount();
      if (!isValid) return;

      setLoading(true);

      const userData: RegistrationFormData = {
        firstName,
        surname,
        phone,
        email,
        nin,
        bvn,
        address,
        zone_id: selectedZone,
        bank_id: selectedBank,
        account_number: accountNumber,
        parallex_id,
        account_name: accountName,
        region_id: selectedRegion,
      };

      const { data } = await axiosInstance.post<ApiResponse<RegistrationResponse>>(
        '/route-pay/parallex-register',
        userData
      );

      if (data.success) {
        try {
          if (data.data) {
            window.localStorage.setItem('user', JSON.stringify(data.data));
          }
          const maybeToken = (data.data as unknown as { authtoken?: string })?.authtoken;
          if (maybeToken) {
            window.localStorage.setItem('auth_token', maybeToken);
          }
        } catch { }

        showToast('Registration successful!', 'success');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // @ts-expect-error unknown error
        showToast(data.response?.data?.message || 'Registration failed', 'error');
      }
    } catch (error: any) {
      showToast('Registration failed ' + error.response?.data?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Format data for dropdowns
  const regionData: DropdownOption[] = regions.map((region) => ({
    key: region.id,
    value: region.name,
  }));

  const zoneData: DropdownOption[] = zones.map((zone) => ({
    key: zone.id,
    value: zone.name,
  }));

  const bankData: DropdownOption[] = banks.map((bank) => ({
    key: bank.id,
    value: bank.bank_name,
  }));

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="px-5 pt-8 pb-5 bg-white">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
            >
              <ChevronLeftIcon className="w-5 h-5 text-blue-600" />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-blue-600">Create new account</h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-5 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <fieldset disabled={loading} className="space-y-4">
              <InputWithLabel
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <InputWithLabel
                label="Surname"
                type="text"
                placeholder="Enter your surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />

              <InputWithLabel
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
              )}
              <div className="text-right text-xs text-gray-400">{phone.length}/11</div>

              <InputWithLabel
                label="Email (Optional)"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputWithLabel
                label="BVN"
                type="text"
                placeholder="Enter your BVN"
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
                maxLength={11}
                required
              />

              <InputWithLabel
                label="NIN"
                type="text"
                placeholder="Enter your NIN"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                required
              />

              <TextareaWithLabel
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <SelectWithLabel
                label="Region"
                options={regionData}
                value={selectedRegion}
                onChangeValue={(val) => {
                  setSelectedRegion(val);
                  setSelectedZone('');
                }}
              />

              <SelectWithLabel
                label="Zone"
                options={zoneData}
                value={selectedZone}
                onChangeValue={(val) => setSelectedZone(val)}
                disabled={!selectedRegion}
              />

              <SelectWithLabel
                label="Bank"
                options={bankData}
                value={selectedBank}
                onChangeValue={(val) => setSelectedBank(val)}
              />

              <InputWithLabel
                label="Account Number"
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setValidationError('');
                  setAccountName('');
                }}
                maxLength={10}
                required
              />
              {isValidating && (
                <p className="text-xs text-gray-500">Validating account…</p>
              )}

              {validationError && (
                <p className="text-red-500 text-center text-sm mt-2">
                  {validationError}
                </p>
              )}
              {fieldErrors.account_number && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.account_number}</p>
              )}
              <div className="text-right text-xs text-gray-400">{accountNumber.length}/10</div>

              {accountName && (
                <p className="text-green-600 text-center text-sm font-medium mt-2">
                  {accountName}
                </p>
              )}

              <InputWithLabel
                label="Terminal ID"
                type="text"
                placeholder="Enter Terminal ID"
                value={parallex_id}
                onChange={(e) => setParallexId(e.target.value)}
                required
              />
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-8 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registering...
                </div>
              ) : (
                'REGISTER'
              )}
            </button>
          </form>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl px-5 py-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">Processing...</span>
          </div>
        </div>
      )}
    </>
  );
}
