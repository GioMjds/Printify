interface ProcessStep {
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Upload Your Document",
    description:
      "Select your .docx or .pdf file, validate format and size, and submit it to our portal for printing.",
  },
  {
    title: "Confirm & Pay",
    description:
      "Enter pickup or delivery details, complete secure payment, and receive an order confirmation with a unique Order ID.",
  },
  {
    title: "Track & Collect",
    description:
      "Monitor real-time status updates and receive a notification when your prints are ready.",
  },
];
