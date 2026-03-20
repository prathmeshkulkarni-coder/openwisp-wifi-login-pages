import React from "react";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import getConfig from "../../utils/get-config";
import loadTranslation from "../../utils/load-translation";
import DoesNotExist from "./404";

jest.mock("../../utils/get-config");
jest.mock("../../utils/load-translation");

const defaultConfig = getConfig("default", true);
const createTestProps = (props) => ({
  orgSlug: "default",
  orgName: "default name",
  page: defaultConfig.components["404_page"],
  setTitle: jest.fn(),
  ...props,
});

const renderPage = (props) =>
  render(
    <MemoryRouter>
      <DoesNotExist {...props} />
    </MemoryRouter>,
  );

describe("<DoesNotExist /> rendering with placeholder translation tags", () => {
  it("should render translation placeholder correctly", () => {
    const props = createTestProps();
    const {container} = renderPage(props);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("<DoesNotExist /> rendering", () => {
  beforeEach(() => {
    loadTranslation("en", "default");
  });

  it("should render correctly default 404 page without props", () => {
    const {container} = render(
      <MemoryRouter>
        <DoesNotExist />
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render correctly custom 404 page with props", () => {
    const props = createTestProps();
    const {container} = renderPage(props);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should set title with organisation name", () => {
    const props = createTestProps();
    renderPage(props);
    expect(props.setTitle).toHaveBeenCalledWith("404 Not found", props.orgName);
  });

  it("should not call setTitle if organization is undefined", () => {
    const props = createTestProps({page: undefined, orgName: undefined});
    renderPage(props);
    expect(props.setTitle).not.toHaveBeenCalled();
  });
});
