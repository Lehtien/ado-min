export const RAFFLE_STATUSES = [
  { value: "OPEN", label: "募集中" },
  { value: "CLOSED", label: "終了" },
  { value: "ADJUSTING", label: "交渉中" },
] as const;

export type RaffleStatus = (typeof RAFFLE_STATUSES)[number]["value"];

export const getRaffleStatusLabel = (status: RaffleStatus) => {
  return RAFFLE_STATUSES.find((s) => s.value === status)?.label;
};
