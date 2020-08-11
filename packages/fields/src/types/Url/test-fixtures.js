import { matchFilter } from '@keystonejs/test-utils';
import Text from './';
import Url from './';

export const name = 'Url';
export { Url as type };
export const exampleValue = '"https://keystonejs.org"';
export const exampleValue2 = '"https://thinkmill.com.au"';
export const supportsUnique = true;

export const getTestFields = () => {
  return {
    order: { type: Text },
    name: { type: Url },
  };
};

export const initItems = () => {
  return [
    { order: 'a', name: '' },
    { order: 'b', name: 'https://test-b.com' },
    { order: 'c', name: 'https://test-c.com' },
    { order: 'd', name: 'http://test-d.org' },
    { order: 'e', name: null },
    { order: 'f' },
  ];
};

// JM: These tests are Mongo/Mongoose specific due to null handling (filtering and ordering)
// See https://github.com/keystonejs/keystone/issues/391

export const filterTests = withKeystone => {
  const match = (keystone, queryArgs, expected) =>
    matchFilter({
      keystone,
      queryArgs,
      fieldSelection: 'order name',
      expected,
      sortKey: 'order',
    });

  test(
    `No 'where' argument`,
    withKeystone(({ keystone }) =>
      match(keystone, '', [
        { order: 'a', name: '' },
        { order: 'b', name: 'https://test-b.com' },
        { order: 'c', name: 'https://test-c.com' },
        { order: 'd', name: 'http://test-d.org' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );
  test(
    `Empty 'where' argument'`,
    withKeystone(({ keystone }) =>
      match(keystone, '', [
        { order: 'a', name: '' },
        { order: 'b', name: 'https://test-b.com' },
        { order: 'c', name: 'https://test-c.com' },
        { order: 'd', name: 'http://test-d.org' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );

  test(
    `filter: {key}`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name: "https://test-c.com" }', [
        { order: 'c', name: 'https://test-c.com' },
      ])
    )
  );

  test(
    `filter: {key}_not`,
    withKeystone(({ keystone }) =>
      match(keystone, `where: { name_not: "https://test-c.com" }`, [
        { order: 'a', name: '' },
        { order: 'b', name: 'https://test-b.com' },
        { order: 'd', name: 'http://test-d.org' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );

  test(
    `filter: {key}_contains`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_contains: "test" }', [
        { order: 'b', name: 'https://test-b.com' },
        { order: 'c', name: 'https://test-c.com' },
        { order: 'd', name: 'http://test-d.org' },
      ])
    )
  );

  test(
    `filter: {key}_not_contains`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_not_contains: "test" }', [
        { order: 'a', name: '' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );

  test(
    `Filter: {key}_ends_with`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_ends_with: "org" }', [
        { order: 'd', name: 'http://test-d.org' },
      ])
    )
  );

  test(
    `filter: {key}_in (empty list)`,
    withKeystone(({ keystone }) => match(keystone, 'where: { name_in: [] }', []))
  );

  test(
    `filter: {key}_in`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_in: ["", "https://test-c.com"] }', [
        { order: 'a', name: '' },
        { order: 'c', name: 'https://test-c.com' },
      ])
    )
  );

  test(
    `filter: {key}_not_in (empty list)`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_not_in: [] }', [
        { order: 'a', name: '' },
        { order: 'b', name: 'https://test-b.com' },
        { order: 'c', name: 'https://test-c.com' },
        { order: 'd', name: 'http://test-d.org' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );
  test(
    `filter: {key}_not_in`,
    withKeystone(({ keystone }) =>
      match(keystone, 'where: { name_not_in: ["", "https://test-c.com"] }', [
        { order: 'b', name: 'https://test-b.com' },
        { order: 'd', name: 'http://test-d.org' },
        { order: 'e', name: null },
        { order: 'f', name: null },
      ])
    )
  );
};
