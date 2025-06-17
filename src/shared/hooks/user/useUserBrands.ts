// Dependencies
import { useQuery } from "@tanstack/react-query";
import { getUserBrands } from "@/services/user";

export const useUserBrands = () => {
  return useQuery({
    queryKey: ["userBrands"], // Remove userId since we get it from auth
    queryFn: getUserBrands,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
