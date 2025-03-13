

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSecure } from '../helpers/secureStore';

const httpLink = createHttpLink({
  uri: 'https://7a7b-2a09-bac5-39fc-88c-00-da-ef.ngrok-free.app'
    // uri: 'http://3.107.187.119/',
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
      try {
          const token = await getSecure('accessToken')
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "",
            }
          }
      } catch (error) {
        console.log("🚀 ~ authLink ~ error:", error)
        return {
            headers: {
              ...headers,
              authorization: "", // Default to no authorization
            }
          }
      }
});

const cache = new InMemoryCache({
  typePolicies: {
      Post: {
          fields: {
              comments: {
                merge(existing = [], incoming = []) {
                  // If incoming is empty object and existing has data, keep existing
                  if (Object.keys(incoming).length === 0 && existing) {
                    return existing;
                  }
                  // If incoming is an array, use it
                  if (Array.isArray(incoming)) {
                    return incoming;
                  }
                  // If incoming is an object with numeric keys (like your case)
                  if (typeof incoming === 'object') {
                    return Object.values(incoming);
                  }
                  return incoming;
                }
              },
              likes: {
                  merge(existing = [], incoming = []) {
                      return incoming; // Similar handling for likes array
                  }
              }
          }
      }
  }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    // cache: new InMemoryCache()
    cache
});

export default client;
