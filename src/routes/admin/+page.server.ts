import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
  console.log("Locals:", locals);
  return {};
};
