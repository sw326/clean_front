import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/members';
import { LoginCredentials, LoginResponse, Member } from '../types/member';

export const useMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: ['members'],
    queryFn: api.fetchMembers,
  });
};

export const useCurrentMember = () => {
  return useQuery<Member, Error>({
    queryKey: ['currentMember'],
    queryFn: api.fetchCurrentMember,
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation<Member, Error, Partial<Member>>({
    mutationFn: api.updateMember,
    onSuccess: (updatedMember) => {
      queryClient.setQueryData(['currentMember'], updatedMember);
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: api.deleteMember,
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.removeQueries({ queryKey: ['member', email] });
    },
  });
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => api.login(credentials),
  });
};

export const useSignup = () => {
  return useMutation<Member, Error, Omit<Member, 'id'> & { password: string }>({
    mutationFn: api.signup,
  });
};