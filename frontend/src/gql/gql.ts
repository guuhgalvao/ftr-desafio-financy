/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateCategory($data: CategoryInput!) {\n    createCategory(data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation CreateTransaction($data: TransactionInput!) {\n    createTransaction(data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($data: RegisterInput!) {\n    register(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {\n    updateCategory(id: $id, data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation UpdateProfile($data: UpdateProfileInput!) {\n    updateProfile(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {\n    updateTransaction(id: $id, data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  query Categories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatarUrl\n      createdAt\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Summary($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      income\n      expense\n    }\n  }\n": typeof types.SummaryDocument,
    "\n  query Transactions($filter: TransactionFilterInput, $pagination: PaginationInput) {\n    transactions(filter: $filter, pagination: $pagination) {\n      items {\n        id\n        description\n        amount\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n": typeof types.TransactionsDocument,
};
const documents: Documents = {
    "\n  mutation CreateCategory($data: CategoryInput!) {\n    createCategory(data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation CreateTransaction($data: TransactionInput!) {\n    createTransaction(data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($data: RegisterInput!) {\n    register(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {\n    updateCategory(id: $id, data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation UpdateProfile($data: UpdateProfileInput!) {\n    updateProfile(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {\n    updateTransaction(id: $id, data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  query Categories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n": types.CategoriesDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatarUrl\n      createdAt\n    }\n  }\n": types.MeDocument,
    "\n  query Summary($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      income\n      expense\n    }\n  }\n": types.SummaryDocument,
    "\n  query Transactions($filter: TransactionFilterInput, $pagination: PaginationInput) {\n    transactions(filter: $filter, pagination: $pagination) {\n      items {\n        id\n        description\n        amount\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n": types.TransactionsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($data: CategoryInput!) {\n    createCategory(data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($data: CategoryInput!) {\n    createCategory(data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransaction($data: TransactionInput!) {\n    createTransaction(data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransaction($data: TransactionInput!) {\n    createTransaction(data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($data: RegisterInput!) {\n    register(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($data: RegisterInput!) {\n    register(data: $data) {\n      token\n      user {\n        id\n        name\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {\n    updateCategory(id: $id, data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($id: ID!, $data: CategoryInput!) {\n    updateCategory(id: $id, data: $data) {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($data: UpdateProfileInput!) {\n    updateProfile(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($data: UpdateProfileInput!) {\n    updateProfile(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {\n    updateTransaction(id: $id, data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {\n    updateTransaction(id: $id, data: $data) {\n      id\n      description\n      amount\n      type\n      date\n      category {\n        id\n        title\n        icon\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Categories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"): (typeof documents)["\n  query Categories {\n    categories {\n      id\n      title\n      description\n      icon\n      color\n      transactionsCount\n      totalAmount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      email\n      avatarUrl\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      name\n      email\n      avatarUrl\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Summary($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      income\n      expense\n    }\n  }\n"): (typeof documents)["\n  query Summary($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      income\n      expense\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Transactions($filter: TransactionFilterInput, $pagination: PaginationInput) {\n    transactions(filter: $filter, pagination: $pagination) {\n      items {\n        id\n        description\n        amount\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n"): (typeof documents)["\n  query Transactions($filter: TransactionFilterInput, $pagination: PaginationInput) {\n    transactions(filter: $filter, pagination: $pagination) {\n      items {\n        id\n        description\n        amount\n        type\n        date\n        category {\n          id\n          title\n          icon\n          color\n        }\n      }\n      total\n      page\n      perPage\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;