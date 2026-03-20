/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
import React from "react";
import {render, act} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import getConfig from "../../utils/get-config";
import getText from "../../utils/get-text";
import Modal from "./modal";
import {mapStateToProps} from "./index";
import logError from "../../utils/log-error";

jest.mock("../../utils/get-config");
jest.mock("../../utils/log-error");
jest.mock("../../utils/get-text", () => jest.fn());
jest.mock("axios");

const defaultConfig = getConfig("default", true);
const createTestProps = (props) => ({
  orgSlug: "default",
  language: "en",
  privacyPolicy: defaultConfig.privacy_policy,
  termsAndConditions: defaultConfig.terms_and_conditions,
  params: {
    name: "terms-and-conditions",
  },
  prevPath: "/default/login",
  navigate: jest.fn(),
  ...props,
});

const renderModal = async (props) => {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter>
        <Modal {...props} />
      </MemoryRouter>,
    );
  });
  return result;
};

describe("<Modal /> rendering", () => {
  let props;

  it("should render terms-and-conditions correctly", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({status: 200, data: {__html: "t&c modal content"}}),
    );
    props = createTestProps();
    const {container} = await renderModal(props);
    expect(container.firstChild).toMatchSnapshot();
    expect(getText.mock.calls.pop()).toEqual([
      props.termsAndConditions,
      props.language,
    ]);
  });

  it("should render privacy-policy correctly", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {__html: "privacy policy modal content"},
      }),
    );
    props = createTestProps({params: {name: "privacy-policy"}});
    const {container} = await renderModal(props);
    expect(container.firstChild).toMatchSnapshot();
    expect(getText.mock.calls.pop()).toEqual([
      props.privacyPolicy,
      props.language,
    ]);
  });

  it("should render nothing on incorrect param name", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({status: 200, data: {__html: ""}}),
    );
    props = createTestProps({params: {name: "test-name"}});
    const {container} = await renderModal(props);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render nothing when request is bad", async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({status: 500, data: {}}),
    );
    props = createTestProps();
    const {container} = await renderModal(props);
    expect(container.firstChild).toMatchSnapshot();
    expect(logError).toHaveBeenCalledWith({status: 500, data: {}});
  });
});

describe("<Modal /> interactions", () => {
  let props;

  beforeEach(() => {
    global.document.addEventListener = jest.fn();
    global.document.removeEventListener = jest.fn();
    axios.mockImplementationOnce(() =>
      Promise.resolve({status: 200, data: {__html: "Modal Content"}}),
    );
    props = createTestProps();
  });

  it("should call navigate on Esc key press", async () => {
    let capturedHandler;
    global.document.addEventListener = jest.fn((event, handler) => {
      if (event === "keyup") capturedHandler = handler;
    });
    await renderModal(props);
    // non-Esc key — should NOT navigate
    capturedHandler({keyCode: 1});
    expect(props.navigate).toHaveBeenCalledTimes(0);
    // Esc key — should navigate
    capturedHandler({keyCode: 27});
    expect(props.navigate).toHaveBeenCalledTimes(1);
    expect(global.document.addEventListener).toHaveBeenCalled();
  });

  it("should map state to props", () => {
    const result = mapStateToProps(
      {
        organization: {
          configuration: {
            privacy_policy: "# Privacy Policy",
            terms_and_conditions: "# Terms and Conditions",
          },
        },
        language: "en",
      },
      {prevPath: "/default/login"},
    );
    expect(result).toEqual({
      privacyPolicy: "# Privacy Policy",
      termsAndConditions: "# Terms and Conditions",
      language: "en",
      prevPath: "/default/login",
    });
  });

  it("should hide scrollbar when modal opens and restore on unmount", async () => {
    const {unmount} = await renderModal(props);
    expect(document.body.style.overflow).toEqual("hidden");
    unmount();
    expect(document.body.style.overflow).toEqual("auto");
  });
});
