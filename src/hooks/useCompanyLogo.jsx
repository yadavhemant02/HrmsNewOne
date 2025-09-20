// src/hooks/useCompanyLogo.js
import { useGetCompanyLogoQuery } from '../redux/services/authApi';

export const useCompanyLogo = () => {
  // Get organization code from localStorage
  const organizationCode = localStorage.getItem('organizationCode') || '';
  
  // Use the RTK Query hook with the organization code
  const {
    data: logoUrl,
    isLoading: logoLoading,
    isError: logoError,
    refetch: refetchLogo
  } = useGetCompanyLogoQuery(organizationCode, {
    // Skip query if no organization code is available
    skip: !organizationCode,
    // Cache for 1 hour
    pollingInterval: 60 * 60 * 1000,
  });
  
  return {
    logoUrl,
    logoLoading,
    logoError,
    refetchLogo
  };
};