import React from "react";

import { render, cleanup } from "@testing-library/react";

import Confirm from "components/Appointment/Confirm";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<Confirm />);
});
