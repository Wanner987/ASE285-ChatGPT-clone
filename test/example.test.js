// Example Jest unit test

function add(a, b) {
  return a + b;
}

describe('example add function', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative and positive numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
