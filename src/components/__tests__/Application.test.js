import React from "react";

import { render, cleanup, waitForElement, fireEvent,
  prettyDOM, getByText, getAllByTestId, getByAltText,
  getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";
import axios from "__mocks__/axios";

afterEach(cleanup);

// it("renders without crashing", () => {
//   render(<Application />);
// });

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  
  });
  
  // SECOND
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // CLICKING THE ADD BUTTON
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // INPUTTING STUDENT NAME
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // CLICK THE INTERVIEWER NAME
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // CLICK ON THE SAVE BUTTON
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // CONFIRM THAT MONDAY HAS NO SPOTS OPEN
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, /monday/i)
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

  });


  // THIRD
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, /monday/i)
    );

    const spotsBeforeDelete = getByText(day, /remaining/i).innerHTML.split(" ")[0];

  
    // 3. Click the "Delete" button on the first booked appointment.
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(appointment => 
      queryByAltText(appointment, "Edit")
    );

    // ANOTHER METHOD
    // const appointment = getAllByTestId(container, "appointment").find(
    //   appointment => queryByText(appointment, "Archie Cohen")
    // );

    fireEvent.click(getByAltText(appointment, "Delete"));


    // 4. Confirm that "Cancel" and "Delete" buttons are on the page.
    expect(getByText(appointment, /are you sure you would like to delete?/i)).toBeInTheDocument();
    expect(getByText(appointment, /cancel/i)).toBeInTheDocument();
    expect(getByText(appointment, /confirm/i)).toBeInTheDocument();
    

    // 5. Click the confirm button to cancel the interview.
    fireEvent.click(getByText(appointment, /confirm/i));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the text "Add" is displayed.
    await waitForElement(() => queryByAltText(appointment, "Add"));
;

    // 8. Confirm the number of appointments has increased by 1.
    const spotsAfterDelete = getByText(day, /remaining/i).innerHTML.split(" ")[0];
    expect(Number(spotsAfterDelete)).toBe(Number(spotsBeforeDelete) + 1);

    // debug();

  });

  // FOURTH
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, /monday/i)
    );
  
    // 3. Click the "Edit" button on the first booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));


    // 4. Edit student name and/or change interviewer.
    // student-name-input
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    

    // 5. Click the save button to save the changes to interview.
    fireEvent.click(getByText(appointment, /save/i));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
;

    // 8. Confirm the number of appointments stays the same.
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    // debug();
  });


  // FIFTH
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // // CLICKING THE ADD BUTTON
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // // INPUTTING STUDENT NAME
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // // CLICK THE INTERVIEWER NAME
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // // CLICK ON THE SAVE BUTTON
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, /Could not book appointment/i));

    // debug();
  });


  // SIXTH
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Click the delete button
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // CLICKING THE DELETE BUTTON
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Confirm that "Cancel" and "Delete" buttons are on the page.
    expect(getByText(appointment, /are you sure you would like to delete?/i)).toBeInTheDocument();

    // 5. Click the confirm button to cancel the interview.
    fireEvent.click(getByText(appointment, /confirm/i));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait for the element with the text "Interview deleted." to appear.
    await waitForElement(() => getByText(appointment, /Could not cancel appointment/i));

    // debug();
  });

});