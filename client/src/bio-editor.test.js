// import modules
import BioEditor from "./components/BioEditor";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "./axios";

// mock axios
jest.mock("./axios");

// Test 1 when no bio is passed
test('when no bio is passed, the button says "add Bio"', () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("button").innerHTML).toBe("add Bio");
});

// Test 2 when a bio is passed
test('when a bio is passed, the button says "edit Bio"', () => {
    const { container } = render(<BioEditor bio={"whatever"} />);
    expect(container.querySelector("button").innerHTML).toBe("edit Bio");
});

// Test 3 when we save the bio
test('clicking "add Bio" or "edit Bio" causes a textarea and "save" to be rendered', () => {
    const { container } = render(<BioEditor />);
    fireEvent.click(container.getElementsByClassName("bio-btn"));
    expect(container.innerHTML).toContain("textarea");
    expect(container.getElementsByClassName("bio-btn")).not.toBeNull();
});

// Fake value from post request
axios.post.mockResolvedValue({
    data: {
        success: true,
    },
});

// Test 4 when click save button
test('clicking "save" causes an ajax request', () => {
    const { container } = render(<BioEditor textareaToggle={() => {}} />);
    fireEvent.click(container.getElementsByClassName("bio-btn"));
    fireEvent.click(container.querySelector("bio-btn"));
    expect(axios.post.mock.calls).toHaveLength(1);
});

// Test 5 when the mock request success
test(
    "when the mock request is successful, " +
        "the function that was passed as a prop " +
        "to the component gets called",
    async () => {
        const mockSetBio = jest.fn();
        const { container } = render(<BioEditor textareaToggle={mockSetBio} />);
        fireEvent.click(container.getElementsByClassName("bio-btn"));
        fireEvent.click(container.getElementsByClassName("bio-btn"));
        await waitFor(() =>
            expect(container.getElementsByClassName("bio-btn")).toBeNull()
        );
        expect(mockSetBio.mock.calls).toHaveLength(1);
    }
);
