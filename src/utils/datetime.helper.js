import { formatDistanceToNow } from "date-fns";

export const formatFromNow = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true
  });
};
