// /src/components/TimePeriodFilter/index.tsx

import React from "react";
import classNames from "clsx";
import styles from "./TimePeriodFilter.module.scss";

export type BrandTimePeriod = "week" | "month" | "all";

interface TimePeriodFilterProps {
  selectedPeriod: BrandTimePeriod;
  onPeriodChange: (period: BrandTimePeriod) => void;
  className?: string;
}

const periodLabels: Record<BrandTimePeriod, string> = {
  week: "this week",
  month: "this month",
  all: "all time",
};

function TimePeriodFilter({
  selectedPeriod,
  onPeriodChange,
  className,
}: TimePeriodFilterProps): React.ReactNode {
  const periods: BrandTimePeriod[] = ["week", "month", "all"];

  return (
    <div className={classNames(styles.container, className)}>
      {periods.map((period) => (
        <button
          key={period}
          className={classNames(styles.filterButton, {
            [styles.active]: selectedPeriod === period,
          })}
          onClick={() => onPeriodChange(period)}
        >
          {periodLabels[period]}
        </button>
      ))}
    </div>
  );
}

export default TimePeriodFilter;
