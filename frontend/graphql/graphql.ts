import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
  EmailAddress: { input: any; output: any; }
  ObjectID: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Content = {
  __typename?: 'Content';
  createdAt: Scalars['DateTimeISO']['output'];
  encoding: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ObjectID']['output'];
  mimetype: Scalars['String']['output'];
  owner: Scalars['ObjectID']['output'];
  path: Scalars['String']['output'];
  size: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type ContentsResponse = {
  __typename?: 'ContentsResponse';
  data: Array<Content>;
  params: ContentsResponseParams;
};

export type ContentsResponseParams = {
  __typename?: 'ContentsResponseParams';
  currentPage: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteContents: Scalars['Boolean']['output'];
  signIn: AuthPayload;
  signUp: AuthPayload;
  uploadContent: Scalars['String']['output'];
};


export type MutationDeleteContentsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationSignInArgs = {
  input: UserInput;
};


export type MutationSignUpArgs = {
  input: UserInput;
};


export type MutationUploadContentArgs = {
  file: Scalars['Upload']['input'];
  size: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  contents: ContentsResponse;
  me: User;
};


export type QueryContentsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  uploadProgress: UploadProgressResponse;
};

export type UploadProgressResponse = {
  __typename?: 'UploadProgressResponse';
  load: Scalars['Float']['output'];
  save: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['EmailAddress']['output'];
  files?: Maybe<Array<Content>>;
  id: Scalars['ObjectID']['output'];
};

export type UserInput = {
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  input: UserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: any, email: any } } };

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: any, email: any } } };

export type GetContentQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetContentQuery = { __typename?: 'Query', contents: { __typename?: 'ContentsResponse', data: Array<{ __typename?: 'Content', filename: string, mimetype: string, path: string, encoding: string, id: any, createdAt: any, size: number }>, params: { __typename?: 'ContentsResponseParams', currentPage: number, total: number } } };

export type DeleteContentMutationVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type DeleteContentMutation = { __typename?: 'Mutation', deleteContents: boolean };

export type UploadProgressSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UploadProgressSubscription = { __typename?: 'Subscription', uploadProgress: { __typename?: 'UploadProgressResponse', load: number, save: number } };

export type MutationMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  size: Scalars['Float']['input'];
}>;


export type MutationMutation = { __typename?: 'Mutation', uploadContent: string };


export const LoginDocument = gql`
    mutation Login($input: UserInput!) {
  signIn(input: $input) {
    token
    user {
      id
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: UserInput!) {
  signUp(input: $input) {
    token
    user {
      id
      email
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetContentDocument = gql`
    query GetContent($limit: Float, $offset: Float) {
  contents(limit: $limit, offset: $offset) {
    data {
      filename
      mimetype
      path
      encoding
      id
      createdAt
      size
    }
    params {
      currentPage
      total
    }
  }
}
    `;

/**
 * __useGetContentQuery__
 *
 * To run a query within a React component, call `useGetContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContentQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetContentQuery(baseOptions?: Apollo.QueryHookOptions<GetContentQuery, GetContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContentQuery, GetContentQueryVariables>(GetContentDocument, options);
      }
export function useGetContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContentQuery, GetContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContentQuery, GetContentQueryVariables>(GetContentDocument, options);
        }
export function useGetContentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetContentQuery, GetContentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetContentQuery, GetContentQueryVariables>(GetContentDocument, options);
        }
export type GetContentQueryHookResult = ReturnType<typeof useGetContentQuery>;
export type GetContentLazyQueryHookResult = ReturnType<typeof useGetContentLazyQuery>;
export type GetContentSuspenseQueryHookResult = ReturnType<typeof useGetContentSuspenseQuery>;
export type GetContentQueryResult = Apollo.QueryResult<GetContentQuery, GetContentQueryVariables>;
export const DeleteContentDocument = gql`
    mutation DeleteContent($ids: [String!]!) {
  deleteContents(ids: $ids)
}
    `;
export type DeleteContentMutationFn = Apollo.MutationFunction<DeleteContentMutation, DeleteContentMutationVariables>;

/**
 * __useDeleteContentMutation__
 *
 * To run a mutation, you first call `useDeleteContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContentMutation, { data, loading, error }] = useDeleteContentMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteContentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContentMutation, DeleteContentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContentMutation, DeleteContentMutationVariables>(DeleteContentDocument, options);
      }
export type DeleteContentMutationHookResult = ReturnType<typeof useDeleteContentMutation>;
export type DeleteContentMutationResult = Apollo.MutationResult<DeleteContentMutation>;
export type DeleteContentMutationOptions = Apollo.BaseMutationOptions<DeleteContentMutation, DeleteContentMutationVariables>;
export const UploadProgressDocument = gql`
    subscription UploadProgress {
  uploadProgress {
    load
    save
  }
}
    `;

/**
 * __useUploadProgressSubscription__
 *
 * To run a query within a React component, call `useUploadProgressSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUploadProgressSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUploadProgressSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUploadProgressSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UploadProgressSubscription, UploadProgressSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UploadProgressSubscription, UploadProgressSubscriptionVariables>(UploadProgressDocument, options);
      }
export type UploadProgressSubscriptionHookResult = ReturnType<typeof useUploadProgressSubscription>;
export type UploadProgressSubscriptionResult = Apollo.SubscriptionResult<UploadProgressSubscription>;
export const MutationDocument = gql`
    mutation Mutation($file: Upload!, $size: Float!) {
  uploadContent(file: $file, size: $size)
}
    `;
export type MutationMutationFn = Apollo.MutationFunction<MutationMutation, MutationMutationVariables>;

/**
 * __useMutationMutation__
 *
 * To run a mutation, you first call `useMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mutationMutation, { data, loading, error }] = useMutationMutation({
 *   variables: {
 *      file: // value for 'file'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useMutationMutation(baseOptions?: Apollo.MutationHookOptions<MutationMutation, MutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MutationMutation, MutationMutationVariables>(MutationDocument, options);
      }
export type MutationMutationHookResult = ReturnType<typeof useMutationMutation>;
export type MutationMutationResult = Apollo.MutationResult<MutationMutation>;
export type MutationMutationOptions = Apollo.BaseMutationOptions<MutationMutation, MutationMutationVariables>;