export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "ready_to_pickup":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-blue-100 text-blue-800 border-blue-300";
  }
};
