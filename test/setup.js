const mockDate = new Date();

global.Date = class MockDate extends Date {
  constructor() {
    super();
    return mockDate;
  }
};

export {
  mockDate,
};

