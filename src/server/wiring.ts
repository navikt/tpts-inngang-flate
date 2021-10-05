import { Express } from 'express';
import { RedisClient } from 'redis';

import { devPersonClient } from './adapters/devPersonClient';
import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import devRedisClient from './devRedisClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import devLeggPåVentClient from './leggpåvent/devLeggPåVentClient';
import leggPåVentClient from './leggpåvent/leggPåVentClient';
import { personClient } from './person/personClient';
import redisClient from './redisClient';
import tildelingClient from './tildeling/tildelingClient';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _tildelingClient = tildelingClient(config.oidc, devOnBehalfOf);

    const _devPersonClient = devPersonClient(instrumentation);

    return {
        person: {
            personClient: _devPersonClient,
            onBehalfOf: devOnBehalfOf,
            config,
        },

        redisClient: devRedisClient,

        tildeling: { tildelingClient: _tildelingClient },

        leggPåVent: { leggPåVentClient: devLeggPåVentClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);

    const _tildelingClient = tildelingClient(config.oidc, _onBehalfOf);

    const _personClient = personClient(instrumentation, config.oidc, _onBehalfOf);

    const _leggPåVentClient = leggPåVentClient(config.oidc, _onBehalfOf);

    return {
        person: {
            personClient: _personClient,
            onBehalfOf: _onBehalfOf,
            config,
        },

        redisClient: _redisClient,

        tildeling: { tildelingClient: _tildelingClient },

        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        instrumentation,
    };
};

export default { getDependencies };
