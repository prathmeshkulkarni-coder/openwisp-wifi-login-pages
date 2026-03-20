import React from "react";
import {render} from "@testing-library/react";

import getConfig from "../../utils/get-config";
import loadTranslation from "../../utils/load-translation";
import Contact from "./contact";

jest.mock("../../utils/get-config");
jest.mock("../../utils/load-translation");

const defaultConfig = getConfig("default", true);
const links = [
  {
    alt: {en: "twitter"},
    icon: "twiter.svg",
    url: "https://twitter.com/openwisp",
    authenticated: true,
    css: "twitter",
  },
  {
    alt: {en: "facebook"},
    icon: "facebook.svg",
    url: "https://facebook.com/openwisp",
    authenticated: false,
    css: "facebook",
  },
  {
    alt: {en: "google"},
    icon: "google.svg",
    url: "https://google.com/openwisp",
    css: "google",
  },
];
const createTestProps = (props) => ({
  language: "en",
  orgSlug: "default",
  contactPage: defaultConfig.components.contact_page,
  userData: {is_verified: true},
  ...props,
});

describe("<Contact /> rendering with placeholder translation tags", () => {
  it("should render translation placeholder correctly", () => {
    const props = createTestProps();
    const {container} = render(<Contact {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("<Contact /> rendering", () => {
  let props;
  beforeEach(() => {
    loadTranslation("en", "default");
  });

  it("should render correctly", () => {
    props = createTestProps();
    const {container} = render(<Contact {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render without authenticated links when not authenticated", () => {
    props = createTestProps();
    props.contactPage.social_links = links;
    props.isAuthenticated = false;
    const {container} = render(<Contact {...props} />);
    expect(container.querySelectorAll(".contact-image")).toHaveLength(2);
    expect(container.querySelector(".link.google")).toBeTruthy();
    expect(container.querySelector(".link.facebook")).toBeTruthy();
    expect(container.querySelector(".link.twitter")).toBeNull();
  });

  it("should render with authenticated links when authenticated", () => {
    props = createTestProps();
    props.contactPage.social_links = links;
    props.isAuthenticated = true;
    const {container} = render(<Contact {...props} />);
    expect(container.querySelectorAll(".contact-image")).toHaveLength(2);
    expect(container.querySelector(".link.google")).toBeTruthy();
    expect(container.querySelector(".link.twitter")).toBeTruthy();
    expect(container.querySelector(".link.facebook")).toBeNull();
  });
});
