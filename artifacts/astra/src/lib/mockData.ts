export const guardians = [
  { id: 1, name: "Ananya F.", distance: "80m", eta: "2 min", status: "arriving", phone: true },
  { id: 2, name: "Rahul K.", distance: "120m", eta: "4 min", status: "police", phone: false },
  { id: 3, name: "Meera S.", distance: "150m", eta: "5 min", status: "online", phone: true },
];

export const walkData = {
  destination: "College",
  eta: "8 min",
  activeGuardians: 2,
  alerts: [
    { type: "success", text: "✓ Route clear" },
    { type: "warning", text: "⚠️ Dark alley ahead — rerouted" }
  ]
};
