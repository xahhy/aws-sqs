const mockDate = new Date();

global.Date = class MockDate extends Date {
  constructor() {
    super();
    return mockDate;
  }
};

// eslint-disable-next-line
export { mockDate };
