import { queryOptions } from "@tanstack/react-query";
import { getCurrentUserClient } from "../repositories/get-current-user-client";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: ["user"],
    queryFn: () => getCurrentUserClient(),
  });
}
