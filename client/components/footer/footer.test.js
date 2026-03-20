/* eslint-disable camelcase */
import React from "react";
import {render, screen} from "@testing-library/react";

import getConfig from "../../utils/get-config";
import loadTranslation from "../../utils/load-translation";
import Footer from "./footer";

jest.mock("../../utils/get-config");
jest.mock("../../utils/load-translation");

const defaultConfig = getConfig("default", true);

const footerLinks = [
  {
    text: {en: "status"},
    url: "/status",
    authenticated: true,
  },
  {
    text: {en: "signUp"},
    url: "/signUp",
    authenticated: false,
  },
  {
    text: {en: "about"},
    url: "/about",
  },
  {
    text: {en: "change-password"},
    url: "/change-password",
    authenticated: true,
    verified: true,
  },
];

const createTestProps = (props) => ({
  language: "en",
  footer: {
    links: defaultConfig.components.footer.links,
    after_html: {
      en: "after html",
    },
  },
  orgSlug: "default",
  userData: {is_verified: true},
  ...props,
});

describe("<Footer /> rendering with placeholder translation tags", () => {
  it("should render translation placeholder correctly", () => {
    const props = createTestProps();
    const {container} = render(<Footer {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("<Footer /> rendering", () => {
  let props;
  beforeEach(() => {
    props = createTestProps();
    loadTranslation("en", "default");
  });

  it("should render correctly", () => {
    const {container} = render(<Footer {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render without links", () => {
    props = createTestProps({footer: {...props.footer, links: []}});
    const {container} = render(<Footer {...props} />);
    expect(container.querySelectorAll(".footer-link")).toHaveLength(0);
  });

  it("should render after html", () => {
    const {container} = render(<Footer {...props} />);
    expect(container.querySelector(".footer-row-2-inner").textContent).toBe(
      "after html",
    );
  });

  it("should render without authenticated links when not authenticated", () => {
    props.footer.links = footerLinks;
    props.isAuthenticated = false;
    const {container} = render(<Footer {...props} />);
    const linkTexts = Array.from(
      container.querySelectorAll(".footer-link"),
    ).map((el) => el.textContent);
    expect(linkTexts).toContain("about");
    expect(linkTexts).toContain("signUp");
    expect(linkTexts).not.toContain("status");
    expect(linkTexts).not.toContain("change-password");
  });

  it("should render with authenticated links when authenticated", () => {
    props.footer.links = footerLinks;
    props.isAuthenticated = true;
    const {container} = render(<Footer {...props} />);
    const linkTexts = Array.from(
      container.querySelectorAll(".footer-link"),
    ).map((el) => el.textContent);
    expect(linkTexts).not.toContain("signUp");
    expect(linkTexts).toContain("about");
    expect(linkTexts).toContain("status");
    expect(linkTexts).toContain("change-password");
  });

  it("should not render with verified links if not verified", () => {
    props.footer.links = footerLinks;
    props.isAuthenticated = true;
    props.userData.is_verified = false;
    const {container} = render(<Footer {...props} />);
    const linkTexts = Array.from(
      container.querySelectorAll(".footer-link"),
    ).map((el) => el.textContent);
    expect(linkTexts).not.toContain("signUp");
    expect(linkTexts).toContain("about");
    expect(linkTexts).toContain("status");
    expect(linkTexts).not.toContain("change-password");
  });
});
