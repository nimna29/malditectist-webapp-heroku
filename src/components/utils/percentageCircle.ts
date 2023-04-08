export function calculateStrokeDasharray(value: string) {
    const percentage = Math.round(parseFloat(value));
    return `${percentage}, 100`;
  }
  
  export function getStrokeColor(value: string) {
    const percentage = Math.round(parseFloat(value));
    if (percentage >= 90) {
      return "#FF0000";
    } else if (percentage >= 85 && percentage < 90) {
      return "#E6D305";
    } else {
      return "#04D300";
    }
  }