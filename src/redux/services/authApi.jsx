
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URLS } from '../../utils/axiosConfig';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URLS.identity,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register new company
    registerCompany: builder.mutation({
      query: (data) => ({
        url: '/identity-handler/create/create-existing-user',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Upload company logo
    uploadLogo: builder.mutation({
      query: (formData) => ({
        url: '/identity-handler/logo/add-details',
        method: 'POST',
        body: formData,
        // Don't set Content-Type when sending FormData
        formData: true,
      }),
    }),
    
    // Login with credentials
    login: builder.mutation({
      query: (credentials) => ({
        url: '/identity-handler/auth/login-existing-user',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Verify OTP
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: '/identity-handler/auth/login-with-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    
    // Resend OTP
    resendOtp: builder.mutation({
      query: (email) => ({
        url: '/identity-handler/auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    
    // Get user profile
    getUserProfile: builder.query({
      query: () => '/identity-handler/profile',
    }),

    // Get company logo
    getCompanyLogo: builder.query({
      query: (organizationCode) => ({
        url: `/identity-handler/logo/get-comapny-logo`,
        params: { organizationCode },
      }),
      transformResponse: (response) => {
        if (response && response.logo) {
          return `data:image/png;base64,${response.logo}`;
        }
        return null;
      },
    }),
  }),
});

export const {
  useRegisterCompanyMutation,
  useUploadLogoMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetUserProfileQuery,
  useGetCompanyLogoQuery,
} = authApi;