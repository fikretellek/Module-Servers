export default function validateNewBooking(reservation) {
  const expectedKeys = {
    title: "string",
    givenName: "string",
    familyName: "string",
    email: "string",
    roomId: "number",
    checkInDate: "string",
    checkOutDate: "string",
  };

  const errors = [];

  for (const [key, type] of Object.entries(expectedKeys)) {
    const value = reservation[key];

    if (!(key in reservation)) {
      return `Missing ${key}`;
    }
    if (value === null || value === undefined || value === "") {
      return `Please enter a ${key}`;
    }
    if (typeof value !== type) {
      return `Invalid ${key}`;
    }
    if (type === "string" && value.trim() === "") {
      return `Please enter a ${key}`;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (key === "email" && !emailPattern.test(value)) {
      return `Invalid email format`;
    }
  }
  return true;
}
