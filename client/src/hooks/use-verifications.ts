import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useLocation } from "wouter";

export function useVerifications() {
  return useQuery({
    queryKey: [api.verifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.verifications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch verifications history");
      return api.verifications.list.responses[200].parse(await res.json());
    },
  });
}

export function useVerification(id: number) {
  return useQuery({
    queryKey: [api.verifications.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.verifications.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch verification result");
      return api.verifications.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateVerification() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Note: We cannot rely on Zod to validate FormData before sending 
      // because files are binary. We send raw FormData and handle 400s.
      const res = await fetch(api.verifications.create.path, {
        method: api.verifications.create.method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to upload for verification");
      }

      return api.verifications.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.verifications.list.path] });
      setLocation(`/result/${data.id}`);
    },
  });
}
