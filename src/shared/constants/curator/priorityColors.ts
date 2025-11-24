export const PRIORITY_COLORS = {
    CRÍTICA: {
      text: "text-destructive",
      bg: "bg-red-100",
      border: "border-red-300",
    },
    ALTA: {
      text: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-300",
    },
    MEDIA: {
      text: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-300",
    },
    NORMAL: {
      text: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-300",
    },
  } as const;
  
  export const getStatusColor = (priority: keyof typeof PRIORITY_COLORS) => {
    return PRIORITY_COLORS[priority]?.text || "text-green-600";
  };
  
  export const getBadgeColor = (priority: keyof typeof PRIORITY_COLORS) => {
    const p = PRIORITY_COLORS[priority];
    return p
      ? `${p.bg} ${p.text} ${p.border} border`
      : "bg-green-100 text-green-600 border border-green-300";
  };
  