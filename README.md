Proof of Concept: React 19 Upgrade & RTL Migration
- Overview

  This branch serves as a Proof of Concept (POC) for modernizing the openwisp-wifi-login-pages repository.

  The primary goal is to:

  Ensure compatibility with React 19

  Migrate the testing infrastructure from the deprecated Enzyme framework to React Testing Library (RTL)

  As outlined in the GSoC 2026 proposal, Enzyme is no longer reliable for React 18+ due to Concurrent Mode limitations. This POC demonstrates   a safe and scalable migration strategy.

- Key Achievements
    Upgraded Core Engine

  Updated:

  react → ^19.0.0

  react-dom → ^19.0.0

  react-test-renderer → ^19.0.0

- Removed Legacy Enzyme Setup

  Removed:

  @cfaester/enzyme-adapter-react-18

  Cleaned up:

  config/jest.config.js

  This ensures:

  No dependency on Enzyme globals

Fully independent RTL-based testing

 Migrated Test Suites (4 Components)

Rewritten using modern React Testing Library (RTL) patterns:

client/components/404/404.test.js

client/components/contact-box/contact.test.js

client/components/footer/footer.test.js

client/components/modal/modal.test.js

🔁 Migration Approach:

Replaced enzyme → render, screen

Focus on user behavior testing instead of implementation details

Improved readability and maintainability

- Proof of Execution

All migrated test suites pass successfully under React 19:

yarn jest client/components/404/404.test.js \
          client/components/contact-box/contact.test.js \
          client/components/footer/footer.test.js \
          client/components/modal/modal.test.js
✔ Result:

<img width="1278" height="281" alt="Screenshot from 2026-03-20 11-11-38" src="https://github.com/user-attachments/assets/538e10e0-fa2f-4c5c-9227-704e59be4f25" />

