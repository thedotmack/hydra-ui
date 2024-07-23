export function getExpirationString(
  expiration: number,
  UTCSecondsNow: number,
  config?: {
    delimiter?: " " | ":";
    capitalizeSuffix: boolean;
    showZeros?: boolean;
    includes?: {
      suffix: string;
      durationSeconds: number;
      mod: number;
    }[];
  }
) {
  const ranges = config?.includes ?? [
    {
      suffix: "d",
      durationSeconds: 60 * 60 * 24,
    },
    {
      suffix: "h",
      durationSeconds: 60 * 60,
      mod: 24,
    },
    {
      suffix: "m",
      durationSeconds: 60,
      mod: 60,
    },
    {
      suffix: "s",
      durationSeconds: 1,
      mod: 60,
    },
  ];
  const secondsRemaining = expiration - UTCSecondsNow;
  const floorOrCeil = (n: number) =>
    n < 0 ? 0 : expiration - UTCSecondsNow > 0 ? Math.floor(n) : Math.ceil(n);

  const numString = (n: number, suffix: string): string => {
    return floorOrCeil(n) || config?.showZeros
      ? `${floorOrCeil(n)}${suffix}`
      : "";
  };

  return ranges
    .map(({ durationSeconds, mod, suffix }) =>
      numString(
        mod
          ? (secondsRemaining / durationSeconds) % mod
          : secondsRemaining / durationSeconds,
        config?.capitalizeSuffix ? suffix.toUpperCase() : suffix
      )
    )
    .join(config?.delimiter ?? " ");
}

export function shortDateString(utc_seconds: number) {
  return `${new Date(utc_seconds * 1000).toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  })} ${new Date(utc_seconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function longDateString(utcSeconds: number) {
  return new Date(utcSeconds * 1000).toLocaleTimeString(["en-US"], {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function secondstoDuration(durationSeconds: number) {
  const years = Math.floor(durationSeconds / 31449600);
  const months = Math.floor((durationSeconds % 31449600) / 2419200);
  const weeks = Math.floor((durationSeconds % 2419200) / 604800);
  const days = Math.floor((durationSeconds % 604800) / 86400);
  const hours = Math.floor((durationSeconds % 86400) / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  let duration = "";
  const optionalVals = [`${years}Y`, `${months}M`, `${weeks}w`, `${days}d`];
  const vals = [`${hours}h`, `${minutes}m`, `${seconds}s`];
  for (const val of optionalVals) {
    if (parseInt(val.substring(0, val.length - 1)) > 0) {
      duration += val + " ";
    }
  }
  for (const val of vals) {
    duration += val + " ";
  }
  return duration;
}

export const secondsToString = (
  requiredSeconds: number | undefined | null,
  showSeconds = true
) => {
  if (!requiredSeconds || requiredSeconds <= 0) return "0";
  const weeks = Math.floor(requiredSeconds / 60 / 60 / 24 / 7);
  const days = Math.floor((requiredSeconds / 60 / 60 / 24) % 7);
  const hours = Math.floor((requiredSeconds / 60 / 60) % 24);
  const minutes = Math.floor((requiredSeconds / 60) % 60);
  const seconds = Math.round(requiredSeconds % 60);

  return `${weeks ? `${weeks}w ` : ""} ${days ? `${days}d ` : ""}${
    !weeks && hours ? `${hours}h ` : ""
  }${!weeks && minutes ? `${minutes}m ` : ""}${
    seconds && showSeconds ? `${seconds}s` : ""
  }`;
};
