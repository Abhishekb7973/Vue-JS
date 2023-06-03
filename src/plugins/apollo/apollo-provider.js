import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import VueApollo from 'vue-apollo';
import { FApolloClient } from './FApolloClient.js';

export const ncogearthchainFApolloClient = new FApolloClient({
    apolloProviders: [
        {
            http: 'https://xapi.ncogchain.earth/',
            // for subscriptions
            ws: '',
        },
    ],
    defaultProviderIndex: 'random',
});

export const testFApolloClient = new FApolloClient({
    apolloProviders: [{
        http: 'https://xapi-test.ncogchain.earth/'
        // http: 'https://xapi.techpay.io/',
    }],
    defaultProviderIndex: 'random',
});


export const ncogearthchainApolloClient = new ApolloClient({
    link: ApolloLink.from([
        ncogearthchainFApolloClient.getNetErrorLink(),
        ncogearthchainFApolloClient.getRetryLink(),
        ncogearthchainFApolloClient.getErrorLink(),
        ncogearthchainFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export const testApolloClient = new ApolloClient({
    link: ApolloLink.from([
        testFApolloClient.getNetErrorLink(),
        testFApolloClient.getRetryLink(),
        testFApolloClient.getErrorLink(),
        testFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});


Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    clients: {
        ncogearthchain: ncogearthchainApolloClient,
        test: testApolloClient,
    },
    defaultClient: testApolloClient,
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only', // 'cache-and-network', 'network-only', 'cache-first'
        },
    },
});
