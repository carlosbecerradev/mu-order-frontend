const DATE_UNITS = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const getDateDiffs = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = (timestamp - now);
  for(const [unit, secondsInUnit] of DATE_UNITS){
    if(Math.abs(elapsed) > secondsInUnit || unit === "second"){
      const value = Math.round(elapsed / secondsInUnit); 
      return {value, unit};
    }
  }
};

export default function useTimeAgo(timestampInSeconds) {
    if(timestampInSeconds == null){
      return ""
    }         
    const {value, unit} = getDateDiffs(timestampInSeconds);
    const rtf = new Intl.RelativeTimeFormat('es', {
      style: "short" });
    return rtf.format(value, unit);
}