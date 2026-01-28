export const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸/🇨🇦" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
   // Add more as needed or keep it brief for MVP
].sort((a, b) => a.country.localeCompare(b.country));
